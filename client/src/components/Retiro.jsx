import '../assets/css/Retiro.css'
import icono from '../assets/img/icon/logoCb.png'
import cerrarsesion from '../assets/img/cerrarsesion.png'
import arrow from '../assets/img/arrow.png'
import fondo from '../assets/img/FondoAzul.jpg'
import axios from "axios";
import Swal from 'sweetalert2'
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Whatsapp from './Whatsapp'
import { SaldoContext } from '../components/SaldoContext.jsx';
import { useContext } from 'react'

const Retiro = () => {
    const {saldo,  setSaldo} = useContext(SaldoContext);
    const { id } = useParams();
    const [usuario, setUsuario] = useState({});
    const [nombre, setNombre] = useState("");
    const [monto, setMonto] = useState("");
    const [cedula, setCedula] = useState("");
    const [cuenta_ahorros, setCuenta_ahorros] = useState(false);
    const [cuenta_corriente, setCuenta_corriente] = useState(false);
    const [tipo_accion, setTipo_accion] = useState("Retiro");

    useEffect(() => {
        // Usar el ID del usuario obtenido de la URL o del estado local
        axios.get(`http://127.0.0.1:8000/api/usuarios/65692aefdf2ebe74457ea6b1`, { withCredentials: true })
            .then(res => {
                setUsuario(res.data);
            })
            .catch(err => console.log(err));
    }, [id]);

    //WhatSapp

    const phoneNumber = '+573225962363';

    const defaultMessage = 'Hola, me podrias ayudar en...';

    const [wallets, setWallets] = useState([]);

    const [errors, setErrors] = useState({});
    const [registroOperaciones, setRegistroOperaciones] = useState([]);

    const navegate = useNavigate();

    const guardarRetiro = e => {
        e.preventDefault();
        axios.post("http://127.0.0.1:8000/api/deposito/new", {
            nombre,
            monto,
            cedula,
            cuenta_ahorros,
            cuenta_corriente,
            tipo_accion
        }, { withCredentials: true })
            .then((res) => {
                // Actualizar el saldo después de realizar el depósito
                
                // Restablecer el valor del monto
                setMonto('');
                // Navegar a la página principal u otro destino deseado
                navegate('/');
            })
            .catch((err) => setErrors(err.response.data.errors));
    };


    const cerrarSesion = () => {
        axios.get('http://127.0.0.1:8000/api/logout', { withCredentials: true })
            .then(res => navegate('/loginRegistro'))
            .catch(err => console.log(err));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (isNaN(parseFloat(monto))) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "¡Lo siento, algo falló! :(",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
    
        // Verificar si hay suficiente saldo para el retiro
        else if (parseFloat(monto) > saldo) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "No puedes retirar mas de lo que tienes!",
                showConfirmButton: false,
                timer: 1500
            });
            monto = null
            return;
        }
        
        else {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Retiro realizado correctamente",
                showConfirmButton: false,
                timer: 1500
            });
              // Actualizar el estado de saldo
        const nuevoSaldo = saldo - parseFloat(monto);
        setSaldo(nuevoSaldo);
    
        // Limpiar los campos
        setMonto('');
        setNombre('');
        setCedula('');
        // ... Limpiar otros campos según sea necesario
    
        // Actualizar el registro de operaciones (opcional)
        const mensaje = `-$ ${monto}`;
        setRegistroOperaciones((prevRegistros) => [...prevRegistros, mensaje]);
    
      
        return;
        }
      
    };
    
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
                            <div className="info-title" style={{ borderBottom: '1px solid rgba(163, 163, 163, 0.658)' }}>
                                <h1>Retiros</h1>
                            </div>
                            <div class="info-list">
                                <div class="scroll-container2">
                                    <form onSubmit={(e) => {e.preventDefault();handleSubmit(e);guardarRetiro(e);}} class="formDeposito" id="operacionForm">
                                        <div class="labelCard">
                                            <div style={{opacity: 0, visibility: 'hidden'}}>
                                                <label class="labelDeposito" htmlFor="tipo_accion" >Tipo de operacion:</label>
                                                <input type="text" id="tipo_accion" name="tipo_accion" value={tipo_accion}  onChange={e => setTipo_accion(e.target.value)}/>
                                            </div>
                                            <div>
                                                <label htmlFor="nombre" class="labelDeposito" >Nombre</label>
                                                <input type="text" id="nombre" name="nombre"  class="inputDeposito input-name"  value={nombre} onChange={e => setNombre(e.target.value)}/>
                                                {errors.nombre ? <span className="text-danger">{errors.nombre.message}</span>: null}
                                                <label htmlFor="cedula" class="labelDeposito">Cedula</label>
                                                <input type="text" id="cedula"  name="cedula" class="inputDeposito input-email" value={cedula} onChange={e => setCedula(e.target.value)} />
                                                {errors.cedula ? <span className="text-danger">{errors.cedula.message}</span>: null}
                                            </div>
                                            <div>
                                                <label htmlFor="monto" class="labelDeposito" >Monto</label>
                                                <input type="number" id="monto" name='monto' class="inputDeposito input-password" value={monto} onChange={(e) => setMonto(e.target.value)}/>
                                                <label className="labelDeposito" style={{ paddingBlock: '5px' }}>Tipo de cuenta</label>
                                                <select class="inputDeposito input-password">
                                                    <option value={cuenta_ahorros} id="cuenta_ahorros" name='cuenta_ahorros' onChange={(e) => setCuenta_ahorros(e.target.value)}>Ahorros</option>
                                                    <option value={cuenta_corriente} id="cuenta_corriente" name='cuenta_corriente' onChange={(e) => setCuenta_corriente(e.target.value)}>Corriente</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button type="submit" value="Deposito" class="primary-button login-button">Retirar</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div class="card-hover__extra">
                        <h2>Cuenta de ahorro <p>{usuario.cuentaDeAhorros}</p></h2>
                        <div>
                            <h3>Saldo disponible</h3>
                            <p id="saldoActual"> $ {saldo}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Whatsapp phoneNumber={phoneNumber} defaultMessage={defaultMessage} />
        </body>
    )
}

export default Retiro