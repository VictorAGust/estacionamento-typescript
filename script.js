(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calculateTime(milliseconds) {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes}m e ${seconds}s`;
    }
    function parking() {
        function read() {
            return localStorage.parking ? JSON.parse(localStorage.parking) : [];
        }
        function toSave(vehicle) {
            localStorage.setItem("parking", JSON.stringify(vehicle));
        }
        function add(vehicle, save) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${vehicle.name}</td>
                <td>${vehicle.plate}</td>
                <td>${vehicle.prohibited}</td>
                <td>
                    <button class="delete" data-plate="${vehicle.plate}"> Retirar </button>
                </td>
                `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remove(this.dataset.plate);
            });
            (_b = $("#parking")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (save)
                toSave([...read(), vehicle]);
        }
        function remove(plate) {
            const { prohibited, name } = read().find((vehicle) => vehicle.plate === plate);
            const time = calculateTime(new Date().getTime() - new Date(prohibited).getTime());
            if (!confirm(`O veículo ${name} permaneceu por ${time}. Deseja encerrar?`))
                return;
            toSave(read().filter((vehicle) => vehicle.plate !== plate));
            render();
        }
        function render() {
            $("#parking").innerHTML = "";
            const parking = read();
            if (parking.length) {
                parking.forEach((vehicle) => add(vehicle));
            }
        }
        return { read, add, remove, toSave, render };
    }
    parking().render();
    (_a = $("#register")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const name = (_a = $("#name")) === null || _a === void 0 ? void 0 : _a.value;
        const plate = (_b = $("#plate")) === null || _b === void 0 ? void 0 : _b.value;
        if (!name || !plate) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }
        parking().add({ name, plate, prohibited: new Date().toISOString() }, true);
    });
})();
