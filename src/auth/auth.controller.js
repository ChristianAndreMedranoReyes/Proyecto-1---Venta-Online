import { hash, verify } from 'argon2';
import Usuario from '../user/user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) =>{
    const { email, password, username} = req.body;

    try{
        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase(): null;

        const user = await Usuario.findOne({
            $or : [{email: lowerEmail }, {username: lowerUsername}]
        });

        if (!user) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas, Correo inexistente'
            });
        }
        if (!user.status){
            return res.status(400).json({
                msg: 'Usuario inexistente'
            })
        }
        const validPassword = await verify(user.password, password);
        if (!validPassword){
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            });
        }

        const token = await generarJWT(user.id);

        return res.status(200).json({
            msg: "INICIO DE SESION EXISTOSO",
            userDetails:{
                username: user.username,
                token: token,
            }
        })
        
    }catch (error){
        console.log(error);
        res.status(500).json({
            msg: 'server error',
            error: error.message
        })
    }
}

export const register = async (req, res) => {
    try {
        const data = req.body;

        const encryptedPassword = await hash (data.password);

        const user = await Usuario.create({
            name: data.name,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
        })

        return res.status(201).json({
            msg: "Usuario registrado",
            userDetails:{
                user: user.email
            }
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: "Registro fallido",
            error: error.message
        })
    }
}