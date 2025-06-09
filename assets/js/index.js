const api_key = "8fa2432c782847ce97d01449243110"
const updateBtn = document.getElementById("update")
const searchCityBtn = document.getElementById("searchCity")
const getLocationBtn = document.getElementById("getLocation")
const climaContainer = document.getElementById("clima")
const tabBtns = document.querySelectorAll(".tab-btn")
const tabContents = document.querySelectorAll(".tab-content")

// Función para cambiar entre pestañas
function setupTabs() {
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab")

      // Actualizar botones activos
      tabBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      // Mostrar contenido de pestaña correspondiente
      tabContents.forEach((content) => content.classList.remove("active"))
      document.getElementById(`${tabId}-tab`).classList.add("active")
    })
  })
}

// Función para obtener el clima por coordenadas
function getClimaByCoords() {
  const latitud = document.getElementById("latitud").value
  const longitud = document.getElementById("longitud").value

  if (!latitud || !longitud) {
    showError("Por favor, ingresa valores válidos para latitud y longitud.")
    return
  }

  showLoading()

  const url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${latitud},${longitud}&aqi=no`

  fetchWeatherData(url)
}

// Función para obtener el clima por nombre de ciudad
function getClimaByCity() {
  const city = document.getElementById("city").value

  if (!city) {
    showError("Por favor, ingresa el nombre de una ciudad o país.")
    return
  }

  showLoading()

  const url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${encodeURIComponent(city)}&aqi=no`

  fetchWeatherData(url)
}

// Función para hacer la petición a la API
function fetchWeatherData(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo obtener la información del clima")
      }
      return response.json()
    })
    .then((data) => {
      displayWeatherData(data)
    })
    .catch((error) => {
      console.error(error)
      showError("No se pudo obtener la información del clima. Verifica los datos e intenta nuevamente.")
    })
}

// Función para mostrar los datos del clima
function displayWeatherData(data) {
  // Obtener la hora local y formatearla
  const localTime = new Date(data.location.localtime)
  const formattedTime = localTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const formattedDate = localTime.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })

  // Determinar si es día o noche
  const isDay = data.current.is_day === 1

  // Crear HTML para mostrar la información del clima
  climaContainer.innerHTML = `
        <div class="weather-info">
            <div class="weather-header">
                <div class="location-info">
                    <h2>${data.location.name}</h2>
                    <p>${data.location.region ? data.location.region + ", " : ""}${data.location.country}</p>
                    <p>${formattedDate} | ${formattedTime}</p>
                </div>
                <div class="weather-icon">
                    <img src="${data.current.condition.icon}" alt="${data.current.condition.text}">
                </div>
            </div>
            
            <div class="weather-main">
                <div class="weather-temp">${data.current.temp_c}°C</div>
                <div class="weather-condition">${data.current.condition.text}</div>
            </div>
            
            <div class="weather-details">
                <div class="weather-item">
                    <i class="fas fa-wind"></i>
                    <span>Viento: ${data.current.wind_kph} km/h</span>
                </div>
                <div class="weather-item">
                    <i class="fas fa-tint"></i>
                    <span>Humedad: ${data.current.humidity}%</span>
                </div>
                <div class="weather-item">
                    <i class="fas fa-compress-arrows-alt"></i>
                    <span>Presión: ${data.current.pressure_mb} mb</span>
                </div>
                <div class="weather-item">
                    <i class="fas fa-eye"></i>
                    <span>Visibilidad: ${data.current.vis_km} km</span>
                </div>
            </div>
        </div>
    `

  // Añadir clase para animación de entrada
  climaContainer.classList.add("animate")

  // Cambiar el fondo según si es día o noche
  document.body.classList.toggle("night-mode", !isDay)

  // Si se buscó por ciudad, actualizar los campos de coordenadas
  if (document.querySelector(".tab-btn[data-tab='city']").classList.contains("active")) {
    document.getElementById("latitud").value = data.location.lat
    document.getElementById("longitud").value = data.location.lon
  }
}

// Función para mostrar mensaje de error
function showError(message) {
  climaContainer.innerHTML = `
        <div class="weather-placeholder">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `
}

// Función para mostrar animación de carga
function showLoading() {
  climaContainer.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
        </div>
    `
}

// Función para obtener la ubicación actual del usuario
function getCurrentLocation() {
  if (navigator.geolocation) {
    showLoading()

    navigator.geolocation.getCurrentPosition(
      (position) => {
        document.getElementById("latitud").value = position.coords.latitude.toFixed(6)
        document.getElementById("longitud").value = position.coords.longitude.toFixed(6)

        // Cambiar a la pestaña de coordenadas
        tabBtns.forEach((b) => b.classList.remove("active"))
        document.querySelector(".tab-btn[data-tab='coords']").classList.add("active")

        tabContents.forEach((content) => content.classList.remove("active"))
        document.getElementById("coords-tab").classList.add("active")

        // Obtener el clima con las coordenadas
        getClimaByCoords()
      },
      (error) => {
        console.error(error)
        showError(
          "No se pudo obtener tu ubicación. Por favor, permite el acceso a la ubicación o ingresa los datos manualmente.",
        )
      },
    )
  } else {
    showError("Tu navegador no soporta la geolocalización.")
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Configurar pestañas
  setupTabs()

  // Botones de búsqueda
  updateBtn.addEventListener("click", getClimaByCoords)
  searchCityBtn.addEventListener("click", getClimaByCity)
  getLocationBtn.addEventListener("click", getCurrentLocation)

  // Permitir búsqueda al presionar Enter en los inputs
  document.getElementById("latitud").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      getClimaByCoords()
    }
  })

  document.getElementById("longitud").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      getClimaByCoords()
    }
  })

  document.getElementById("city").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      getClimaByCity()
    }
  })

  // Animación de partículas
  const particles = document.querySelectorAll(".particle")
  particles.forEach((particle) => {
    const randomX = Math.random() * window.innerWidth
    const randomY = Math.random() * window.innerHeight
    particle.style.left = `${randomX}px`
    particle.style.top = `${randomY}px`
  })
})
