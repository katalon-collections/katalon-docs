try {
	if (!localStorage.getItem('katalon-docs-lang-redirect')) {
		localStorage.setItem('katalon-docs-lang-redirect', '1');
		if (!navigator.language.toLowerCase().startsWith('de')) {
			window.location.replace('/katalon-docs/en/');
		}
	}
} catch (e) {
	/* localStorage nicht verfuegbar (privater Modus, eingebetteter Frame) - kein Redirect */
}
