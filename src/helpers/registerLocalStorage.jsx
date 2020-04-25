const registerLocalStorageNoBackendValues = (value) => {
  localStorage.setItem('customQL', JSON.stringify(value));
};

export default registerLocalStorageNoBackendValues;
