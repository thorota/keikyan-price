import logo from './logo.svg';
import DatePicker, { registerLocale, handleChange, handleChangeDateRange} from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import React, {useState} from 'react'
import moment from 'moment';
import ja from "date-fns/locale/ja";

//checkboxコンポーネント
const CheckBox = ({id, value, checked, onChange}) => {
  return (
    <input
      id={id}
      type="checkbox"
      name="inputNames"
      checked={checked}
      onChange={onChange}
      value={value}
    />
  )
}

const options = [
  {name:"すべて", price: 8250},
  {name:"テント", price: 1100},
  {name:"寝袋", price: 1100},
  {name:"Wi-Fi", price: 1100},
  {name:"リクライニングチェア", price: 1100},
  {name:"電動クーラーボックス", price: 1100},
  {name:"LEDランタン", price: 550},
  {name:"椅子", price: 550},
  {name:"クーラーボックス", price: 550},
  {name:"扇風機", price: 550},
  {name:"チャイルドシート", price: 550},
  {name:"アルコール", price: 0},
  {name:"ティッシュ", price: 0},
  {name:"タオル", price: 0},
]

const App = () => {

  // 日本語対応
  registerLocale('ja', ja);

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  const today = new Date()
  const [checkedItems, setCheckedItems] = useState({})

  const handleChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleInputChange = (option) =>{
    setCheckedItems({
      ...checkedItems,
      name: option.name
    })
    console.log('checkedItems:', checkedItems)
  }

  const calcPrice = () => {

  }

  return (
    <div className="container">
      <header className="header">

      </header>
      <section className='l-title'>
        <h1 className='p-title'>PRICE</h1>
        <h5 className='p-title__sub'>料金シミュレーション</h5>
        <img src="/img/price-title-icon.png" className='p-title__icon'></img>
      </section>
      <section className='l-price'>
        <p className='p-price__title'>レンタル料金を計算</p>
        <div>
          <div className='p-price__desc'>
            <div className='p-price__desc--title'>
              <p className='p-price__desc--num'>01</p>
              <p className='p-price__desc--heading'>利用する日程を選択してください</p>
            </div>
            <div className='p-price__calendar'>
              <DatePicker
                locale="ja"
                renderCustomHeader={({
                  year,
                  monthDate,
                  changeYear,
                  changeMonth,
                  customHeaderCount,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                <div>
                  <div
                    style={
                      customHeaderCount === 1 ? 
                      { visibility: "hidden",
                        margin: 10,
                        display: "flex",
                        justifyContent: "center",
                      } : {
                        margin: 10,
                        display: "flex",
                        justifyContent: "start",
                      }
                    }
                  >
                    <button className='button-prev' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                      {"< 前月"}
                    </button>
                    <span className="react-datepicker__current-year">
                      {monthDate.toLocaleString("ja", {
                        year: "numeric",
                      })}
                    </span>
                    <button className='button-next' onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                      {"翌月 >"}
                    </button>
                  </div>

                  <div className='react-datepicker__current-months'>
                    <span className="react-datepicker__current-month">
                      {monthDate.toLocaleString("ja", {
                        month: "long",
                      })}
                    </span>
                  </div>
                </div>
                )}
                inline
                minDate={today}
                onChange={handleChange}
                monthsShown={2}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                calendarStartDay={1}
              />
            </div>
          </div>
          <div>
            <div className='p-price__desc--title'>
              <p className='p-price__desc--num'>02</p>
              <p className='p-price__desc--heading'>車種を選択してください</p>
            </div>
            <div className='p-price__car--list'>
              <div className='p-price__car--item'>
                <div>
                  <img className='p-price__car--img coming-soon' src='/img/comingsoon.png'></img>
                  <p className='p-price__car--name'>coming soon</p>
                </div>
              </div>
              <div className='p-price__car--item'>
                <button>
                  <img className='p-price__car--img' src='/img/suzuki-every.png'></img>
                  <p className='p-price__car--name'>スズキエブリィバン4w</p>
                </button>
              </div>
              <div className='p-price__car--item'>
                <div>
                  <img className='p-price__car--img coming-soon' src='/img/comingsoon.png'></img>
                  <p className='p-price__car--name'>coming soon</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className='p-price__desc--title'>
              <p className='p-price__desc--num'>03</p>
              <p className='p-price__desc--heading'>追加オプションを選択してください</p>
            </div>
            <form>
              <div className='p-price__option--list'>
                {options.map((option, index)=>{
                  index = index + 1
                  return (
                    <label htmlFor={`id_${index}`} key={`key_${index}`} className='p-price__option--item'>
                      <CheckBox
                        id={`id_${index}`}
                        value={option}
                        onChange={(e) => handleInputChange(option)}
                        checked={checkedItems[option.id]}
                      />
                      {option.name}    
                    </label>               
                  );
                })}
              </div>
            </form>
          </div>
          <div>
            <div className='p-price__desc--title'>
              <p className='p-price__desc--num'>04</p>
              <p className='p-price__desc--heading'>自動車保険の加入を選択してください</p>
            </div>
            <div className='p-price__option--list'>
              <button className='p-price__option--item'>加入する</button>
              <button className='p-price__option--item'>加入しない</button>
            </div>
            <p className='text-center p-price__option--term'>保険の詳細については<a href=''>こちら</a>をご覧ください</p>
          </div>
          <div  className='p-price__calc text-center'>
            <button onClick={calcPrice}>計算する</button>
          </div>
          <div className='p-price__calc-result'>
            <p className='p-price__calc-result--title'>ご利用料金</p>
            <p className='p-price__calc-result--price'>¥{}</p>
            <p className='p-price__calc-result--breakdown'>内訳</p>
            <div className='p-price__calc-result--list'>
              <p className='p-price__calc-result--item'><span>基本料金</span><span>¥{}</span></p>
              <p className='p-price__calc-result--item'><span>基本料金</span><span>¥{}</span></p>
            </div>
          </div>
          <div  className='p-price__calc-reserv'>
           <a href='https://rsvsys-1615.rsvsys.demo.iqnet.co.jp/' target='blank'>この内容で予約する
            <span>→</span>
           </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
