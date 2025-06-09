const api_key = '8fa2432c782847ce97d01449243110';

const update = document.getElementById('update');

function getClima() {
    const latitud = document.getElementById('latitud').value;
    const longitud = document.getElementById('longitud').value
    const url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${latitud},${longitud}&aqi=no`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const climaContainer = document.getElementById('clima');
            console.log(data);
            climaContainer.innerHTML = `
                <h2>El clima en ${data.location.name}, ${data.location.region}, ${data.location.country}</h2>
                <h3>Hora: ${data.location.localtime}</h3>
                <h3>Temperatura: ${data.current.temp_c} °C</h3>
                <h3>Condición: ${data.current.condition.text}</h3>
                <img src="${data.current.condition.icon}">
            `
        })
        .catch(error => {
            console.error(error);
        });
}

update.addEventListener('click', getClima);