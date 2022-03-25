const setLocalStorage = (user) => {
  let storage;
  try {
    storage = window.localStorage;
    storage.setItem("user", user);
  } catch (error) {
    console.log(error);
  }
};

export default setLocalStorage;
