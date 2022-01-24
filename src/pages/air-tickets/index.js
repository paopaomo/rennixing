import {
  Button,
  Form,
  Input,
  Card,
  Pagination,
  Spin,
  Result,
} from "antd";
import './index.css';
import {bookAirFlights, getAirTickets} from "../../service/air";
import {useEffect, useMemo, useRef, useState} from "react";
import {getAirTicketsByQuery, saveAirTicketsByQuery} from "../../utils/air";

const Item = Form.Item;

const AirTickets = () => {
  const [tickets, setTickets] = useState([])
  const [isSearched, setIsSearched] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hasNoCachedData, setHasNoCachedData] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [bookedState, setBookedState] = useState('')

  const buttonEle = useRef(null);

  const currentTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * 10
    return tickets.slice(startIndex, startIndex + 10)
  }, [currentPage, tickets])

  useEffect(() => {
    buttonEle.current.click()
  }, [])

  const onFinish = ({ from, to, date }) => {
    setIsSearched(true)
    setLoading(true)
    setHasNoCachedData(false)
    return getAirTickets({ from, to, date }).then(({ airTickets}) => {
      saveAirTicketsByQuery({ from, to, date }, airTickets);
      setTickets(airTickets);
    }).catch(() => {
      const cachedTickets = getAirTicketsByQuery({ from, to, date})
      if(cachedTickets) {
        setTickets(cachedTickets)
      } else {
        setTickets([])
        setHasNoCachedData(true)
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  const handleClick = (id) => {
    bookAirFlights(id).then(({ code }) => {
      let state;
      switch (code) {
        case 'success':
          state = 'success';
          break;
        case 'waiting_for_approval':
          state = 'info';
          break;
        case 'all_booked':
          state = 'warning';
          break;
        default:
          state = '';
          break;
      }
      setBookedState(state);
    }).catch(() => {
      setBookedState('something_error');
    }).finally(() => {
      setTimeout(() => {
        setBookedState('');
      }, 3000)
    })
  }

  const showResult = () => {
    if(!isSearched) {
      return null
    }
    if(hasNoCachedData) {
      return <Result status='error' title='不好意思，网络出错啦，请稍后再试' />
    }
    return <div className='content'>
      {!!currentTickets.length ? <div className='list'>
        <div className='cards'>
          {
            currentTickets.map((ticket, index) => {
              const { startTime, endTime, origin, destination, price, note, duration, aviation, id } = ticket
              return <Card
                title={aviation}
                key={aviation}
                className='card-item'
                extra={<Button
                  onClick={() => handleClick(id)}
                  data-testid={`book-btn-${index}`}
                  >预定</Button>}
              >
                <p>起止时间：{startTime} - {endTime}</p>
                <p>起止地点：{origin} - {destination}</p>
                <p>价格：{price}</p>
                <p>时长：{duration}</p>
                <p>备注：{note}</p>
              </Card>
            })
          }
        </div>
        <Pagination current={currentPage} total={tickets.length} onChange={setCurrentPage} />
      </div> : <Result status='info' title='没有符合要求的机票哦，换个条件试试' />}
    </div>
  }

  return <div className='air-tickets'>
    <Form layout="inline" onFinish={onFinish}>
      <Item label='from' name='from' initialValue='上海' rules={[{ required: true }]}>
        <Input placeholder='please input origin' />
      </Item>
      <Item label='to' name='to' initialValue='西安' rules={[{ required: true }]}>
        <Input placeholder='please input destination' />
      </Item>
      <Item label='date' name='date' initialValue='2021-12-25' rules={[{ required: true }]}>
        <Input placeholder='please input date' />
      </Item>
      <Item>
        <Button htmlType='submit' ref={buttonEle}>Search</Button>
      </Item>
    </Form>
    {bookedState === 'success' && <p style={{ color: 'green'}}>预定成功</p>}
    {bookedState === 'waiting_for_approval' && <p style={{ color: 'blue'}}>已经向部门主管发起申请，请等待哦</p>}
    {bookedState === 'all_booked' && <p style={{ color: 'orange'}}>不好意思，该机票已订完，请试试预定其他机票吧</p>}
    {bookedState === 'something_error' && <p style={{ color: 'red'}}>预定服务不可用，请稍后再试，谢谢~</p>}
    {loading ? <Spin data-testid='loading' /> : showResult()}
  </div>
}

export default AirTickets
