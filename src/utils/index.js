
const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    const seconds = `${date.getSeconds()}`.padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const setStorage = (k, v) => {
    localStorage.setItem(k, v);
}

const getStorage = (k) => localStorage.getItem(k);

const getHomeId = () => {
    return getStorage('homeId');
}

export {
    formatDate,
    setStorage,
    getStorage,
    getHomeId
}