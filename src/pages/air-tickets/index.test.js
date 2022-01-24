import React from 'react'
import {
  render,
  waitForElementToBeRemoved,
  screen,
  fireEvent,
  waitFor
} from "@testing-library/react"
import AirTickets from "./index"
import * as airService from '../../service/air'
import * as airUtils from '../../utils/air'

describe('air tickets', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const getTicketsSpy = jest.spyOn(airUtils, 'getAirTicketsByQuery')
  const saveTicketsSpy = jest.spyOn(airUtils, 'saveAirTicketsByQuery')

  it('show empty tips', async() => {
    jest.spyOn(airService, 'getAirTickets').mockResolvedValue({ airTickets: [] })

    const { getByTestId } = render(<AirTickets />)
    await waitForElementToBeRemoved(() => getByTestId('loading'))
    expect(saveTicketsSpy).toBeCalled()
    expect(screen.queryByText('没有符合要求的机票哦，换个条件试试')).toBeTruthy()
  })

  it('show air tickets', async() => {
    jest.spyOn(airService, 'getAirTickets').mockResolvedValue({ airTickets: [{
        startTime: '2021-12-25 11:00',
        endTime: '2021-12-25 12:00',
        origin: '上海',
        destination: '西安',
        price: 200,
        note: 'note',
        duration: '4h25m',
        aviation: '上海航空FM9550'
      }] })

    const { getByTestId } = render(<AirTickets />)
    await waitForElementToBeRemoved(() => getByTestId('loading'))
    expect(saveTicketsSpy).toBeCalled()
    expect(screen.queryByText('上海航空FM9550')).toBeTruthy()
  })

  it('show 2 page air tickets', async() => {
    const airTickets = []
    for(let i = 0; i < 15; i++) {
      airTickets.push({
        startTime: '2021-12-25 11:00',
        endTime: '2021-12-25 12:00',
        origin: '上海',
        destination: '西安',
        price: 200,
        note: 'note',
        duration: '4h25m',
        aviation: `上海航空FM9550${i}`
      })
    }

    jest.spyOn(airService, 'getAirTickets').mockResolvedValue({ airTickets })

    const { getByTestId, getByTitle } = render(<AirTickets />)
    await waitForElementToBeRemoved(() => getByTestId('loading'))
    expect(saveTicketsSpy).toBeCalled()
    expect(screen.queryByText('上海航空FM95501')).toBeTruthy()
    fireEvent.click(getByTitle('Next Page'))
    expect(screen.queryByText('上海航空FM955013')).toBeTruthy()
  })

  it('should show tickets when network error but has cached data', async() => {
    jest.spyOn(airService, 'getAirTickets').mockRejectedValue({})
    jest.spyOn(airUtils, 'getAirTicketsByQuery').mockReturnValue([{
      startTime: '2021-12-25 11:00',
      endTime: '2021-12-25 12:00',
      origin: '上海',
      destination: '西安',
      price: 200,
      note: 'note',
      duration: '4h25m',
      aviation: '上海航空FM9550'
    }])

    const { getByTestId } = render(<AirTickets />)
    await waitForElementToBeRemoved(() => getByTestId('loading'))
    expect(getTicketsSpy).toBeCalled()
    expect(screen.queryByText('上海航空FM9550')).toBeTruthy()
  })

  it('should show error message when network error and has no cached data', async() => {
    jest.spyOn(airService, 'getAirTickets').mockRejectedValue({})

    const { getByTestId } = render(<AirTickets />)
    await waitForElementToBeRemoved(() => getByTestId('loading'))
    expect(getTicketsSpy).toBeCalled()
    expect(screen.queryByText('不好意思，网络出错啦，请稍后再试')).toBeTruthy()
  })

  it('should show success message when book successfully', async() => {
    jest.spyOn(airService, 'getAirTickets').mockResolvedValue({ airTickets: [{
        startTime: '2021-12-25 11:00',
        endTime: '2021-12-25 12:00',
        origin: '上海',
        destination: '西安',
        price: 200,
        note: 'note',
        duration: '4h25m',
        aviation: '上海航空FM9550'
      }] })
    jest.spyOn(airService, 'bookAirFlights').mockResolvedValue({ code: 'success', data: {message: '预定成功'}})

    const { getByTestId } = render(<AirTickets />)
    await waitForElementToBeRemoved(() => getByTestId('loading'))
    fireEvent.click(getByTestId('book-btn-0'))
    await waitFor(() => {
      expect(screen.queryByText('预定成功')).toBeTruthy()
    }, { timeout: 3000 })
  })

  it('should show error message when network error', async() => {
    jest.spyOn(airService, 'getAirTickets').mockResolvedValue({ airTickets: [{
        startTime: '2021-12-25 11:00',
        endTime: '2021-12-25 12:00',
        origin: '上海',
        destination: '西安',
        price: 200,
        note: 'note',
        duration: '4h25m',
        aviation: '上海航空FM9550'
      }] })
    jest.spyOn(airService, 'bookAirFlights').mockRejectedValue({})

    const { getByTestId } = render(<AirTickets />)
    await waitForElementToBeRemoved(() => getByTestId('loading'))
    fireEvent.click(getByTestId('book-btn-0'))
    await waitFor(() => {
      expect(screen.queryByText('预定服务不可用，请稍后再试，谢谢~')).toBeTruthy()
    }, { timeout: 3000 })
  })
})


