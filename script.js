const form = document.getElementById('contact-form');
const confirmation = document.getElementById('confirmation');
const apiUrl = '/api/forms';

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
		}
	} catch (error) {
		confirmation.textContent = 'No se pudo enviar el formulario.';
		confirmation.hidden = false;
	}
});
