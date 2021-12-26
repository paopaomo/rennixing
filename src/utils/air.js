const AIR_TICKET_MAP = 'AIR_TICKET_MAP'

const getAirTicketsFromStorage = () => {
  return JSON.parse(sessionStorage.getItem(AIR_TICKET_MAP))
}

const getAirTicketsByQuery = ({ from, to, date }) => {
  const airTickets = getAirTicketsFromStorage();
  return airTickets[`${from}-${to}-${date}`]
}

const saveAirTicketsByQuery = ({ from, to, date }, tickets) => {
  const airTickets = getAirTicketsFromStorage();
  sessionStorage.setItem(AIR_TICKET_MAP, JSON.stringify({
    ...airTickets,
    [`${from}-${to}-${date}`]: tickets
  }));
}

export {
  getAirTicketsByQuery,
  saveAirTicketsByQuery
}
