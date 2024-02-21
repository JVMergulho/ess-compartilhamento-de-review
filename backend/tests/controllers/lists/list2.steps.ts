import { loadFeature, defineFeature } from "jest-cucumber"
import axios, { AxiosResponse } from 'axios'
const mongoose = require('mongoose')
const List = require("../../../models/List")
const User = require("../../../models/user")

const feature = loadFeature('tests/features/lists/list2.feature');

const SERVER_URL = 'http://localhost:3001'

export async function connectDBForTesting() {
    try {
      const dbUri = "mongodb://localhost:27017";
      const dbName = "test";
      await mongoose.connect(dbUri, {
        dbName,
        autoCreate: true,
      });
    } catch (error) {
      console.log("DB connect error");
    }
  }
  
  export async function disconnectDBForTesting() {
    try {
      await mongoose.connection.close();
    } catch (error) {
      console.log("DB disconnect error");
    }
  }

defineFeature(feature, test => {

    beforeAll(async () => {
        await connectDBForTesting();
      });
      afterAll(async () => {
        await disconnectDBForTesting();
      });

    let response: AxiosResponse

    test('Excluir lista por ID', ({ given, when, then, and }) => {
        given(/^existe uma lista de restaurantes com ID "(.*)" com autor de ID "(.*)" e nome "(.*)"$/, async (idlist, iduser, namelist) => {
            
            const user = await User.findById(iduser)
            const list = await List.findById(idlist)

            expect(list).toEqual((
                expect.objectContaining({
                    name: namelist,
                    author: user.name
                })
            ))
            
        })
        when(/^uma requisição DELETE é enviada para "(.*)"$/, async (path) => {

            try {
                response = await axios.delete(`${SERVER_URL}${path}`)
            } catch (error) {
                console.error('Error during HTTP request:', error)
                return
            }
        })
        then(/^o status de resposta é "(.*)"$/, (status) => {
            expect(String(response.status)).toBe(status)
        })
        and(/^a lista com ID "(.*)" não pode ser encontrada no banco de dados$/, async (idlist) =>{
            const list = await List.findById(idlist)
            expect(list).toBe(null)
        }) 
            
    });
});
