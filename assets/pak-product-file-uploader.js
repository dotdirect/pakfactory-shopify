function handleFileChange(input) {
  const placeholderId = 'FilePlaceholder-' + input.id.split('-').pop();
  const placeholder = document.getElementById(placeholderId);
  const file = input.files[0];

  console.log('File changed:', file);
  if (file) {
    placeholder.textContent = file.name;
  } else {
    placeholder.textContent = 'Accepted formats: JPG, PNG, PDF — Max 10MB';
  }

  placeholder.textContent = file.name;
}

// Attach listeners automatically on DOM load (optional for progressive enhancement)
document.addEventListener('DOMContentLoaded', function () {
  document
    .querySelectorAll('.quote-file-upload .field__input')
    .forEach((input) => {
      input.addEventListener('change', function () {
        handleFileChange(input);
      });
    });
});
