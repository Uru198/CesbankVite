import '../assets/css/Historial.css'
import icono from '../assets/img/icon/logoCb.png'
import cerrarsesion from '../assets/img/cerrarsesion.png'
import arrow from '../assets/img/arrow.png'
import fondo from '../assets/img/FondoAzul.jpg'
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Whatsapp from './Whatsapp'

const Historial = () => {
    const { id } = useParams();
    const [usuario, setUsuario] = useState({});
    const [autores, setAutores] = useState([]);
    useEffect(() => {
        // Usar el ID del usuario obtenido de la URL o del estado local
        axios.get(`http://127.0.0.1:8000/api/usuarios/656619d815cd9cf1f2603b66`, { withCredentials: true })
            .then(res => {
                setUsuario(res.data);
            })
            .catch(err => console.log(err));
    }, [id]);

    //WhatSapp

    const phoneNumber = '+573225962363';

    const defaultMessage = 'Hola, me podrias ayudar en...';

    const [wallets, setWallets] = useState([]);


    const navegate = useNavigate();

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/wallets", { withCredentials: true })
            .then(res => setWallets(res.data))
            .catch(err => {
                if (err.response.status === 401) {
                    navegate("/loginRegistro");
                }
            });
    }, [navegate])

    const cerrarSesion = () => {
        axios.get('http://127.0.0.1:8000/api/logout', { withCredentials: true })
            .then(res => navegate('/loginRegistro'))
            .catch(err => console.log(err));
    }
    return (
        <body>
            <img class="fondo" src={fondo} alt=""></img>
            <div class="containerPrincipal" id="containerPrincipal">
                <div class="card-hover">
                    <div class="card-hover__content">
                        <img src={icono} alt="" id="logo" />
                        <button for="toggleButton" class="card-hover__link">Tu cartera</button>
                        <img src={cerrarsesion} alt="" id="cerrarSesion" onClick={cerrarSesion} />
                        <h1 class="card-hover__title">
                            Hola, <span id="informacion" class="informacion">{usuario.firstName}</span>
                        </h1>
                    </div>
                    <section id="sectionDepositar">
                        <div class="info_box">
                            <Link to="/"><img src={arrow} alt="flecha" id="logoflecha2" /></Link>
                            <div class="info-title">
                                <div class="wrap">
                                    <div class="search">
                                        <input type="text" class="searchTerm" placeholder="Que quieres buscar?" />
                                        <button type="submit" class="searchButton">
                                            <div class="i"> <i class="fa fa-search"></i></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="info-list">
                                <div>
                                    <p style={{ marginTop: 0, padding: '0 0 0 40px', fontWeight: 'bold', borderBottom: '1px solid lightgrey', margin: 0 }}>Movimientos</p>
                                    <div class="scroll-container" id="registroOperaciones">
                                        {
                                            wallets.map((wallet, index) => (
                                                <tr key={index} className='tr'>
                                                    <div className='card'>
                                                    Operacion: {wallet.tipo_accion}
                                                    <br />
                                                    Monto: ${wallet.monto}
                                                    </div> 
                                                </tr>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div class="card-hover__extra">
                        <h2>Cuenta de ahorro <p>{usuario.cuentaDeAhorros}</p></h2>
                        <div>
                            <h3>Saldo disponible</h3>
                            <p id="saldoActual"> $ 0</p>
                        </div>
                    </div>
                    <div class="factura animate__animated animate__bounceInRight" id="factura">
                        <div class="form-container-factura">
                            <form action="" class="form-factura">
                                <h1 class="title">Factura</h1>
                                <div class="factura1">
                                    <label for="name" class="label">Nombre</label>
                                    <p class="value1" id="informacionname3"></p>
                                    <label for="informacioncedula3" class="label">Cedula</label>
                                    <p class="value1" id="informacioncedula3"></p>
                                    <label for="informacionmonto3" class="label">Monto</label>
                                    <p class="value1" id="informacionmonto3"></p>
                                    <label for="informacionnumeroTransferencia" class="label"># Transferencia</label>
                                    <p class="value1" id="informacionnumeroTransferencia"></p>
                                    <label for="informacionnumeroTransferencia" class="label">Banco</label>
                                    <p class="value1" id="informacionbanco"></p>
                                    <label for="informaciontipocuenta3" class="label">Tipo de cuenta</label>
                                    <p class="value1" id="informaciontipocuenta3"></p>
                                </div>
                                <button class="botonFactura" id="cerrarFactura">Cerrar Factura</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Whatsapp phoneNumber={phoneNumber} defaultMessage={defaultMessage} />
        </body>
    )
}

export default Historial