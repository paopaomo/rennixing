import mockSessionStorage from "../mockSessionStorage";
import { getAirTicketsByQuery, saveAirTicketsByQuery } from "./air";

describe('cached function', () => {
  beforeAll(() => {
    mockSessionStorage();
  })

  afterEach(() => {
    window.sessionStorage.clear();
  })

  const tickets = [{
    startTime: '2021-12-25 11:00',
    endTime: '2021-12-25 12:00',
    origin: '上海',
    destination: '西安',
    price: 200,
    note: 'note',
    duration: '4h25m',
    aviation: '上海航空FM9550'
  }]

  it('save tickets to session storage', () => {
    saveAirTicketsByQuery({ from: '上海', to: '西安', date: '2021-12-25'}, tickets)
    const expectData = JSON.parse(window.sessionStorage.getItem('AIR_TICKET_MAP'))
    expect(expectData).toEqual({ "上海-西安-2021-12-25": tickets })
  })

  it('get tickets from session storage', () => {
    window.sessionStorage.setItem('AIR_TICKET_MAP', JSON.stringify({ "上海-西安-2021-12-25": tickets
    }))
    expect(getAirTicketsByQuery({ from: '上海', to: '西安', date: '2021-12-25' })).toEqual(tickets)
  })
})
