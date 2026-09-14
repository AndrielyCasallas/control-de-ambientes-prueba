const form = document.getElementById('contact-form');
const confirmation = document.getElementById('confirmation');
const formsList = document.getElementById('forms-list');
const apiUrl = '/api/forms';
const fields = [...form.querySelectorAll('input, textarea')];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getFieldError(field) {
	const value = field.value.trim();

	if (!value) {
		return 'Este campo es obligatorio.';
	}

	if (field.name === 'correo' && !emailPattern.test(value)) {
		return 'Ingresa un correo electrónico válido.';
	}

	return '';
}

function setFieldError(field, message) {
	const errorElement = document.getElementById(`${field.id}-error`);
	const hasError = Boolean(message);

	field.classList.toggle('field-invalid', hasError);
	field.setAttribute('aria-invalid', String(hasError));
	errorElement.textContent = message;
}

function validateField(field, animate = false) {
	const message = getFieldError(field);
	setFieldError(field, message);

	if (message && animate) {
		field.classList.remove('field-shake');
		void field.offsetWidth;
		field.classList.add('field-shake');
	}

	return !message;
}

function validateForm() {
	const invalidFields = fields.filter((field) => !validateField(field, true));
	const firstInvalidField = invalidFields[0];

	if (firstInvalidField) {
		firstInvalidField.focus();
		firstInvalidField.select();
	}

	return invalidFields.length === 0;
}

fields.forEach((field) => {
	field.addEventListener('input', () => {
		validateField(field);
		confirmation.hidden = true;
	});
});

async function loadForms() {
	const response = await fetch(apiUrl);
	const forms = await response.json();

	formsList.innerHTML = '';

	forms.forEach((savedForm) => {
		const row = document.createElement('tr');

		['nombre', 'asunto', 'mensaje', 'creado_en'].forEach((field) => {
			const cell = document.createElement('td');
			cell.textContent = savedForm[field];
			row.appendChild(cell);
		});

		formsList.appendChild(row);
	});
}

form.addEventListener('submit', async (event) => {
	event.preventDefault();

	if (!validateForm()) {
		return;
	}

	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(Object.fromEntries(new FormData(form)))
		});

		const result = await response.json();
		confirmation.textContent = response.ok ? result.message : result.error;
		confirmation.hidden = false;

		if (response.ok) {
			form.reset();
			fields.forEach((field) => setFieldError(field, ''));
			loadForms();
		}
	} catch (error) {
		confirmation.textContent = 'No se pudo enviar el formulario.';
		confirmation.hidden = false;
	}
});

loadForms().catch((error) => console.error(error));
