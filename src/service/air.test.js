import mockServer from "../mock";
import {bookAirFlights, getAirTickets} from "./air";

describe('air service', () => {
  let server

  beforeEach(() => {
    server = mockServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('getAirTickets return correct value', async () => {
    server.create('airTicket', {
      startTime: '2021-12-25 11:00',
      endTime: '2021-12-25 12:00',
      origin: '上海',
      destination: '西安',
      price: 200,
      note: 'note',
      duration: '4h25m',
      aviation: '上海航空FM9550',
      id: "1"
    })

    await expect(getAirTickets({ from: '上海', to: '西安', date: '2021-12-25'})).resolves.toEqual({
      airTickets: [
        {
          startTime: '2021-12-25 11:00',
          endTime: '2021-12-25 12:00',
          origin: '上海',
          destination: '西安',
          price: 200,
          note: 'note',
          duration: '4h25m',
          aviation: '上海航空FM9550',
          id: "1"
        }
      ],
    })
  })

  it('bookAirTickets successfully', async () => {
    await expect(bookAirFlights(1)).resolves.toEqual(
    { code: 'success', data: { message: '预定成功' }}
    )
  })
})
