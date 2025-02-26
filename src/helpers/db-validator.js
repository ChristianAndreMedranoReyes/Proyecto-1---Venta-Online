import Role from '../role/role.model.js';
import User from '../user/user.model.js';

export const esRoleValido = async (role = '') =>{

    const existeRol = await Role.findOne({ role });

    if (!existeRol) {
        
        throw new Error(`El rol ${role} no existe en la base de datos`);
    }
}

export const existenteEmail = async (correo = '') =>{

    const existeEmail = await User.findOne({ correo });

    if (existeEmail) {
        throw new Error(`El correo ${correo} no existe en la base de datos`);
    }
} 
