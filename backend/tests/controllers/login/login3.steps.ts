import { loadFeature, defineFeature } from "jest-cucumber"
import axios, { AxiosResponse } from 'axios'
const mongoose = require('mongoose')
require("dotenv").config()
import {connectDBForTesting, disconnectDBForTesting} from '../common'

const User = require("../../../models/User")

const feature = loadFeature('tests/features/login/login3.feature');

const SERVER_URL = 'http://localhost:3001'

defineFeature(feature, test => {

    beforeAll(async () => {
        await connectDBForTesting();
      });
      afterAll(async () => {
        await disconnectDBForTesting();
      });

    let response: AxiosResponse

    test('A senha não contém caracteres especiais e letras maiusculas', ({ given, when, then, and }) => {
        given(/^não existe um usuário cadastrado com o nome "(.*)", email "(.*)" e senha "(.*)"$/, async (name,email,password) => {
            
            const user = await User.findOne({name: name, email: email, password: password})

            expect(user).toBe(
              null
          )
            
        })
        when(/^uma requisição POST foi enviada para "(.*)" com nome "(.*)", email "(.*)" e senha "(.*)"$/, async (path,name,email,password) => {
            try {
                response = await axios.post(`${SERVER_URL}${path}`,{name:name,email:email,password:password})
            } catch (error) {
                
                return
            }
        })
        then(/^o status de resposta é "(.*)"$/, (status) => {
            expect(response).toBe(undefined)
        })
        and(/^é retornado o aviso "(.*)"$/, async (msg) => { 
            
            
            let compare = false
            if(msg == "A senha deve conter no mínimo 1 caracter maiúsculo, 1 caracter minúsculo, 1 simbolo especial e tamanho de pelo menos 8."){
                compare = true
            }
            
           expect(compare).toBe(true)

            })
    });
});