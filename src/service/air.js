import request from './request'

const getAirTickets = ({ from, to, date }) => {
  return request.get('/air-tickets', {
    params: {
      from,
      to,
      date
    }
  }).then(res => res.data)
}

export { getAirTickets }
