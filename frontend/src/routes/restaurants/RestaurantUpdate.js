import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Link, Navigate } from "react-router-dom"
import Modal from "../commons/Modal"

import '../../style/Restaurants.css'

const API_BASE = "http://localhost:3001"

const RestaurantUpdate = () => {

    const navigate = useNavigate()

    const { id } = useParams()

    const [name, setName] = useState('')
    const [site, setSite] = useState('')
    const [typeOfFood, setTypeOfFood] = useState('')
    const [number, setNumber] = useState('')
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [neighborhood, setNeighborhood] = useState('')
    const [files, setFiles] = useState('')
    const [nextPage, setNextPage] = useState('/restaurants')
    const [modalTitle, setModalTitle] = useState('')

    const [openModal, setOpenModal] = useState(false)

    useEffect(() => {
        fetch( API_BASE + '/restaurants/' + id)
            .then(response => {
                response.json().then(data => {
                    let { name, site, typeOfFood, address } = data
                    let {number, street, city, neighborhood} = address

                    setName(name);
                    setSite(site);
                    setTypeOfFood(typeOfFood);
                    setNumber(number);
                    setStreet(street);
                    setCity(city);
                    setNeighborhood(neighborhood);
                    setFiles(files);
                })
            })
    }, []); 

    async function editRestaurant(ev){

        ev.preventDefault()

        const data = new FormData();
        data.append('name', name);
        data.append('site', site);
        data.append('typeOfFood', typeOfFood);
        data.append('file', files[0]); // Assuming files[0] is the file you want to upload

        // Append the nested address object
        data.append('address[number]', number);
        data.append('address[street]', street);
        data.append('address[city]', city);
        data.append('address[neighborhood]', neighborhood);

        const response = await fetch(API_BASE + '/restaurants/edit/' + id, {
            method: 'PUT',
            body: data
        })

        console.log(API_BASE + '/restaurants/edit/' + id)
        console.log(data)

        if(response.ok) {
            setNextPage('/restaurants/' + id)
            setModalTitle('O restaurante foi editado com sucesso')
            setOpenModal(true)
        } else {
            console.error('Failed to create restaurant:', response.statusText);
        }
    }

    async function deleteRestaurant(ev){

        ev.preventDefault()

        const response = await fetch(API_BASE + '/restaurants/delete/'+id, {
            method: 'DELETE'
        })

        console.log(JSON.stringify(response.body))

        if(response.ok) {
            setModalTitle('O restaurante foi deletado com sucesso')
            setOpenModal(true)
        } else {
            console.error('Failed to delete restaurant:', response.statusText);
        }
    }

    return (
        <div>
            <div id = "formpage">
            {openModal && <Modal transparent={true} closeModal={setOpenModal} title={modalTitle} nextPage={nextPage}/>}

                <form>
                    <div>
                        <label htmlFor="restaurantName">Nome do restaurante</label>
                        <input type="text" id="restaurantName" placeholder="Melhor Pizza" value={name} 
                            onChange={ev => setName(ev.target.value)}/>
                    </div>

                    <div>
                        <label htmlFor="typeofFood" >Tipo de comida</label>
                        <input type="text" id="typeofFood" placeholder="Pizza" value={typeOfFood} 
                            onChange={ev => setTypeOfFood(ev.target.value)}/>
                    </div>

                    <div>
                        <label htmlFor="restaurantSite">Site oficial</label>
                        <input type="text" id="restaurantSite" placeholder="melhorpizza.com" 
                        value={site} onChange={ev => setSite(ev.target.value)}/>
                    </div>

                    <p id="address-title" >Endereço</p>

                    <div>
                        <label htmlFor="street">Rua</label>
                        <input type="text" id="street" placeholder="Avenida Paulista" 
                        value={street} onChange={ev => setStreet(ev.target.value)}/>
                    </div>

                    <div>
                        <label htmlFor="number">Número</label>
                        <input type="text" id="number" placeholder="123" value={number} 
                        onChange={ev => setNumber(ev.target.value)}/>
                    </div>

                    <div>
                        <label htmlFor="neighborhood">Bairro</label>
                        <input type="text" id="neighborhood" placeholder="Madalena"
                        value={neighborhood} onChange={ev => setNeighborhood(ev.target.value)}/>
                    </div>

                    <div>
                        <label htmlFor="city">Cidade</label>
                        <input type="text" id="city" placeholder="São Paulo"
                        value={city} onChange={ev => setCity(ev.target.value)}/>
                    </div>

                    <div>
                        <label htmlFor="profilePhoto">Foto da página do restaurante</label>
                        <input type="file" id="profilePhoto"
                        onChange={ev => setFiles(ev.target.files)}/>
                    </div>

                    <button className="simple-button" id="create-button" onClick={editRestaurant}>
                        <p>Enviar</p>
                    </button>

                    <button className="simple-button" id="delete-button" onClick={deleteRestaurant}>
                        <p>Deletar</p>
                    </button>

                </form>
                
            </div>

        </div>
    );
};

export default RestaurantUpdate;