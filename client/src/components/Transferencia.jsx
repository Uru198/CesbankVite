import '../assets/css/Transferencia.css'
import icono from '../assets/img/icon/logoCb.png'
import cerrarsesion from '../assets/img/cerrarsesion.png'
import arrow from '../assets/img/arrow.png'
import fondo from '../assets/img/FondoAzul.jpg'
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Whatsapp from './Whatsapp'
import { SaldoContext } from '../components/SaldoContext.jsx';
import { useContext } from 'react'
import Swal from 'sweetalert2'
import 'animate.css';

const Transferencia = () => {
    const { saldo, setSaldo } = useContext(SaldoContext);
    const { id } = useParams();
    const [monto, setMonto] = useState('');
    const [nombre, setNombre] = useState('');
    const [cedula, setCedula] = useState('');
    const [numeroTransferencia, setNumeroTransferencia] = useState('');
    const [banco, setBanco] = useState('');
    const [tipo_accion, setTipo_accion] = useState("Transferencia");
    const [usuario, setUsuario] = useState({});
    const [mostrarCard, setMostrarCard] = useState(false);
    const [facturaInfo, setFacturaInfo] = useState({
        nombre: '',
        cedula: '',
        monto: '',
        numeroTransferencia: '',
        banco: '',
        tipoCuenta: '',
    });


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

    //--------

    const [transferencias, setTransferencias] = useState([]);

    const [registroOperaciones, setRegistroOperaciones] = useState([]);
    const [errors, setErrors] = useState({});

    const navegate = useNavigate();

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/transferencias", { withCredentials: true })
            .then(res => setTransferencias(res.data))
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
    const guardarTransferencia = e => {
        e.preventDefault();
        console.log("Guardando transferencia...");
        axios.post("http://127.0.0.1:8000/api/transferencia/new", {
            nombre,
            monto,
            cedula,
            banco,
            numeroTransferencia,
            tipo_accion
        }, { withCredentials: true })
            .then((res) => {
                setFacturaInfo({
                    nombre,
                    cedula,
                    monto,
                    numeroTransferencia,
                    banco,
                    tipoCuenta: 'Ahorros'
                });
                setMostrarCard(true);
                setMonto('');

                navegate('/Transferencia');
            })
            .catch((err) => setErrors(err.response.data.errors));
    };

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
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "Transferencia exitosa!"
              });
            console.log("transferencia exitosa");
            // Actualizar el estado de saldo
            const nuevoSaldo = saldo - parseFloat(monto);
            setSaldo(nuevoSaldo);

            // Limpiar los campos
            setMonto('');
            setNombre('');
            setCedula('');
            setBanco('')
            setNumeroTransferencia('')
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
                                <h1>Transferencias</h1>
                            </div>
                            <div class="info-list">
                                <div class="scroll-container4">
                                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); guardarTransferencia(e); }} class="formRetiro" id="operacionTransferir">
                                        <div class="labelCard-transferencia">
                                            <div style={{ opacity: 0, visibility: 'hidden', display: 'none' }}>
                                                <label class="labelDeposito" htmlFor="tipo_accion" >Tipo de operacion:</label>
                                                <input type="text" id="tipo_accion" name="tipo_accion" value={tipo_accion} onChange={e => setTipo_accion(e.target.value)} />
                                            </div>
                                            <div>
                                                <label htmlFor="nombre" class="labelDeposito" >Nombre</label>
                                                <input type="text" id="nombre" name="nombre" class="inputDeposito input-name" value={nombre} onChange={e => setNombre(e.target.value)} />
                                                {errors.nombre ? <span className="text-danger">{errors.nombre.message}</span> : null}
                                                <label htmlFor="cedula" class="labelDeposito">Cedula</label>
                                                <input type="text" id="cedula" name="cedula" class="inputDeposito input-email" value={cedula} onChange={e => setCedula(e.target.value)} />
                                                {errors.cedula ? <span className="text-danger">{errors.cedula.message}</span> : null}
                                            </div>
                                            <div>
                                                <label htmlFor="monto3" class="labelDeposito" >Monto</label>
                                                <input type="number" id="monto" name='monto' class="inputDeposito input-password" value={monto} onChange={(e) => setMonto(e.target.value)} />
                                                <label htmlFor="numeroTransferencia" class="labelDeposito" >Numero de cuenta</label>
                                                <input type="number" id="transferencia" name='transferencia' class="inputDeposito input-password" value={numeroTransferencia} onChange={(e) => setNumeroTransferencia(e.target.value)} />
                                            </div>
                                            <div>
                                                <label htmlFor="Banco" class="labelDeposito" >Banco</label>
                                                <input type="text" id="banco" name='monto' class="inputDeposito input-password" value={banco} onChange={(e) => setBanco(e.target.value)} />
                                                <label class="labelDeposito" style={{ paddingBlock: '5px' }}>Tipo de cuenta</label>
                                                <select class="inputDeposito input-password" id="tipocuenta3">
                                                    <option value="Ahorros">Ahorros</option>
                                                    <option value="Corriente">Corriente</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button type="submit" value="Retirar" class="primary-button login-button" onclick="AgregarInformacionfactura()">Transferir</button>
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
            {mostrarCard && (
                <div class="factura animate__animated animate__bounceInRight" id="factura">
                    <div class="form-container-factura">
                        <form action="" class="form-factura">
                            <h1 class="title">Factura</h1>
                            <div class="factura1">
                                <label for="name" class="label">Nombre</label>
                                <p class="value1" id="informacionname3">{facturaInfo.nombre}</p>
                                <label for="informacioncedula3" class="label">Cedula</label>
                                <p class="value1" id="informacioncedula3">{facturaInfo.cedula}</p>
                                <label for="informacionmonto3" class="label">Monto</label>
                                <p class="value1" id="informacionmonto3">{facturaInfo.monto}</p>
                                <label for="informacionnumeroTransferencia" class="label"># Transferencia</label>
                                <p class="value1" id="informacionnumeroTransferencia">{facturaInfo.numeroTransferencia}</p>
                                <label for="informacionnumeroTransferencia" class="label">Banco</label>
                                <p class="value1" id="informacionbanco">{facturaInfo.banco}</p>
                                <label for="informaciontipocuenta3" class="label">Tipo de cuenta</label>
                                <p class="value1" id="informaciontipocuenta3">{facturaInfo.tipoCuenta}</p>
                            </div>
                            <button class="botonFactura" id="cerrarFactura">Cerrar Factura</button>
                        </form>
                    </div>
                </div>
            )}

            <Whatsapp phoneNumber={phoneNumber} defaultMessage={defaultMessage} />
        </body>
    )
}

export default Transferencia