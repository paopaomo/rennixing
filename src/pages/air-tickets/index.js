import {Button, Form, Input, Card, Pagination, Spin, Result} from "antd";
import './index.css';
import {getAirTickets} from "../../service/air";
import {useEffect, useMemo, useRef, useState} from "react";
import {getAirTicketsByQuery, saveAirTicketsByQuery} from "../../utils/air";

const Item = Form.Item;

const AirTickets = () => {
  const [tickets, setTickets] = useState([])
  const [isSearched, setIsSearched] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hasNoCachedData, setHasNoCachedData] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

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
            currentTickets.map(ticket => {
              const { startTime, endTime, origin, destination, price, note, duration, aviation } = ticket
              return <Card title={aviation} key={aviation} className='card-item'>
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
    {loading ? <Spin data-testid='loading' /> : showResult()}
  </div>
}

export default AirTickets
