import {createServer, Factory, Model} from "miragejs";
import faker from 'faker';

// 工序1: fake BFF
const mockServer = ({ environment = 'development' } = {}) => {
  return createServer({
    environment,

    models: {
      airTicket: Model,
    },

    factories: {
      airTicket: Factory.extend({
        startTime() {
          return faker.date.past().toLocaleDateString()
        },

        endTime() {
          return faker.date.past().toLocaleDateString()
        },

        origin() {
          return faker.address.cityName()
        },

        destination() {
          return faker.address.cityName()
        },

        price() {
          return faker.finance.amount()
        },

        note() {
          return faker.lorem.sentence()
        },

        duration() {
          return '4h25m'
        },

        aviation(i) {
          return `上海航空FM9550${i}`
        }
      }),
    },

    seeds(server) {
      server.createList('airTicket', 15)
    },

    routes() {
      this.namespace = 'api';

      this.get('/air-tickets', (schema) => {
        return schema.airTickets.all()
      })

      this.post('/air-tickets/:id/reserve', () => {
        return { code: 'success', data: {message: '预定成功'}}
      })
    }
  })
}

export default mockServer
