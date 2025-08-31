export function toggleHelpSheet(visible?: boolean) {
    const helpSheet = document.getElementById('help-sheet');
    if (!helpSheet) return;
    const isVisible = helpSheet.classList.contains('visible');
    helpSheet.classList.toggle('visible', visible ?? !isVisible);
}
