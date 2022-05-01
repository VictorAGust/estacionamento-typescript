interface Vehicle {
    name: string,
    plate: string,
    prohibited: Date | string
}

(function(){
    const $ = (query: string): HTMLInputElement | null =>
        document.querySelector(query)

        function calculateTime(milliseconds: number){
            const minutes = Math.floor(milliseconds / 60000)
            const seconds = Math.floor((milliseconds % 60000) / 1000)

            return `${minutes}m e ${seconds}s`
        }

        function parking(){
            
            function read(): Vehicle[]{
                return localStorage.parking ? JSON.parse(localStorage.parking) : []
            }

            function toSave(vehicle: Vehicle[]){
                localStorage.setItem("parking", JSON.stringify(vehicle))
            }

            function add(vehicle:Vehicle, save?: boolean){
                const row = document.createElement("tr")

                row.innerHTML = `
                <td>${vehicle.name}</td>
                <td>${vehicle.plate}</td>
                <td>${vehicle.prohibited}</td>
                <td>
                    <button class="delete" data-plate="${vehicle.plate}"> Retirar </button>
                </td>
                `

                row.querySelector(".delete")?.addEventListener("click", function(){
                    remove(this.dataset.plate)
                })

                $("#parking")?.appendChild(row)

                if(save) toSave([...read(), vehicle])
            }

            function remove(plate: string){
                const { prohibited, name } = read().find(
                    (vehicle) => vehicle.plate === plate)

                const time = calculateTime(new Date().getTime() - new Date(prohibited).getTime())

                if(!confirm(`O veículo ${name} permaneceu por ${time}. Deseja encerrar?`)) return

                toSave(read().filter((vehicle) => vehicle.plate !== plate))
                render()
            }            

            function render(){
                $("#parking")!.innerHTML = ""
                const parking = read()

                if(parking.length){
                    parking.forEach((vehicle) => add(vehicle))
                }
            }

            return { read, add, remove, toSave, render}
        }

        parking().render()

    $("#register")?.addEventListener("click", () => {
        const name = $("#name")?.value
        const plate = $("#plate")?.value

        if(!name || !plate){
            alert("Os campos nome e placa são obrigatórios")
            return
        }

        parking().add({ name, plate, prohibited: new Date().toISOString()}, true)
    })
})()