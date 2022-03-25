const checkLocalStorage = () => {
  let storage;
  let user;
  try {
    storage = window.localStorage;
    user = storage.getItem("user");
    return user;
  } catch (error) {
    return null;
  }
};

export default checkLocalStorage;
