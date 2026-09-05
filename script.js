const form = document.getElementById('contact-form');
const confirmation = document.getElementById('confirmation');
const formsList = document.getElementById('forms-list');
const apiUrl = '/api/forms';

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
			loadForms();
		}
	} catch (error) {
		confirmation.textContent = 'No se pudo enviar el formulario.';
		confirmation.hidden = false;
	}
});

loadForms().catch((error) => console.error(error));
