import logo from './logo.svg';
import DatePicker, {
  registerLocale,
  handleChange,
  handleChangeDateRange,
} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import ja from 'date-fns/locale/ja';
import JapaneseHolidays from 'japanese-holidays';
// var JapaneseHolidays = require('japanese-holidays');

//checkboxコンポーネント
const CheckBox = ({ id, value, checked, onChange }) => {
  return (
    <input
      id={id}
      type="checkbox"
      name="inputNames"
      checked={checked}
      onChange={onChange}
      value={value}
    />
  );
};

//checkboxコンポーネント
const RadioBox = ({ id, value, checked, onChange }) => {
  return (
    <input
      id={id}
      type="radio"
      name="inputNames"
      checked={checked}
      onChange={onChange}
      value={value}
    />
  );
};

const customOptions = [
  { name: 'すべて', price: 0, size: '', checked: false },
  { name: 'テント', price: 1100, size: '', checked: false },
  { name: '寝袋', price: 1100, size: '', checked: false },
  { name: 'Wi-Fi', price: 1100, size: '', checked: false },
  { name: 'リクライニングチェア', price: 1100, size: 'small', checked: false },
  { name: '電動クーラーボックス', price: 1100, size: 'small', checked: false },
  { name: 'LEDランタン', price: 550, size: 'medium', checked: false },
  { name: '椅子', price: 550, size: '', checked: false },
  { name: 'クーラーボックス', price: 550, size: 'small', checked: false },
  { name: '扇風機', price: 550, size: '', checked: false },
  { name: 'チャイルドシート', price: 550, size: 'small', checked: false },
  { name: 'アルコール', price: 0, size: 'medium', checked: false },
  { name: 'ティッシュ', price: 0, size: 'medium', checked: false },
  { name: 'タオル', price: 0, size: '', checked: false },
];

const insuranceOptions = [
  { name: '加入する', price: 1100, checked: false },
  { name: '加入しない', price: 0, checked: true },
];

const basePrice = {
  MONTH: 264000,
  WEEK: 61600,
  WEEKEND: 14300,
  FRIDAY: 9900,
  OTHER: 8800,
};

const App = () => {
  // 日本語対応
  registerLocale('ja', ja);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const today = new Date();

  const [checkedItems, setCheckedItems] = useState([]);
  const [checked, setChecked] = useState([]);
  const [canCheckItems, setCanCheckItems] = useState([]);
  const [checkedInsurance, setCheckedInsurance] = useState(insuranceOptions[0]);

  const [basicPrice, setBasicPrice] = useState(0);
  const [optionPrice, setOptionPrice] = useState(0);
  const [insurancePrice, setInsurancePrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const allCheck = () => {
    setChecked(canCheckItems);
  };

  const clearCheck = () => {
    setChecked([]);
  };

  const onClickAllCheck = (e) => {
    // console.log(e.target.checked);
    if (e.target.checked) {
      allCheck();
    } else {
      clearCheck();
    }
    console.log(checked);
  };

  const toggleChecked = (target) => {
    if (checked.includes(target)) {
      setChecked([...checked.filter((item) => item !== target)]);
    } else {
      setChecked([...checked.concat([target])]);
    }
    console.log(checked);
  };

  const handleChange = (dates) => {
    const [start, end] = dates;
    console.log((end - start) / 86400000);
    setStartDate(start);
    setEndDate(end);
  };

  const handleRadioChange = (option) => {
    setCheckedInsurance(option);
    // let t = insuranceOptions.find(src => src.name === option.name)
    // console.log(t.checked);
  };

  /**
   * 日付の差分計算
   * @param {*} start
   * @param {*} end
   * @returns
   */
  const calcDiffDate = (start, end) => {
    return (endDate - startDate) / 86400000;
  };

  const calcDiffMonth = (start, end) => {
    let d1Month, d2Month;

    d1Month = start.getFullYear() * 12 + start.getMonth();
    d2Month = end.getFullYear() * 12 + end.getMonth();

    return d2Month - d1Month;
  };

  /**
   * 料金計算
   */
  const calcPrice = () => {
    let diffDate = calcDiffDate(startDate, endDate);
    let diffMonth = calcDiffMonth(startDate, endDate);

    console.log(checked);
    // console.log(customOptions[]);

    // オプション
    let resOption = 0;
    let selectedOptions = [];
    for (let i = 0; i < checked.length; i++) {
      selectedOptions.push(customOptions[checked[i]]);
      // console.log(customOptions[checked[i]])
    }
    selectedOptions.sort((src, dist) => dist.price - src.price); //ソート
    if (diffDate >= 2) {
      if (selectedOptions.length > 1) {
        selectedOptions.splice(0, 2);
      } else {
        selectedOptions = [];
      }
    }
    selectedOptions.map((option, index) => {
      resOption += option.price;
    });
    setOptionPrice(resOption);

    // 保険
    const resInsurance = checkedInsurance.price * diffDate;
    console.log(resInsurance);
    setInsurancePrice(resInsurance);

    // 基本料金
    let resBasic = 0;
    if (diffMonth > 0) {
      resBasic += basePrice.MONTH * diffMonth;
      diffDate = diffDate - diffMonth * 30;
    }

    if (diffDate / 7 > 0) {
      resBasic += basePrice.WEEK * parseInt(diffDate / 7);
      diffDate = diffDate % 7;
    }

    for (let i = 1; i <= diffDate; i++) {
      console.log('曜日', startDate.getDay());
      console.log(startDate, JapaneseHolidays.isHoliday(startDate));
      if (
        JapaneseHolidays.isHoliday(startDate) ||
        startDate.getDay() == 0 ||
        startDate.getDay() == 6
      ) {
        resBasic += basePrice.WEEKEND;
      } else if (startDate.getDay() == 5) {
        resBasic += basePrice.FRIDAY;
      } else {
        resBasic += basePrice.OTHER;
      }
      startDate.setDate(startDate.getDate() + 1);
    }
    setBasicPrice(resBasic);
    // console.log("週",diffDate);
    // console.log("月",diffMonth);

    // 小計
    const subtotal = resBasic + resOption + resInsurance;
    setSubtotal(subtotal);
    setTotal(subtotal * 1.1);
  };

  useEffect(() => {
    setCanCheckItems(customOptions.map((option, index) => index));
    return () => {
      // cleanup
    };
  }, []);

  return (
    <>
      <section>
        <img className="bg-wave" src="/img/bg-wave.png" />
      </section>
      <section className='sp-menu only-sp'>
        <a href='https://rsvsys-1615.rsvsys.demo.iqnet.co.jp/'>
          <p className='title'>RESERVE</p>
          <p className='small'>予約する</p>
        </a>
      </section>
      <div className="container">
        <header className="header"></header>
        <section className="l-title">
          <h1 className="p-title">PRICE</h1>
          <h5 className="p-title__sub">料金シミュレーション</h5>
          <img src="/img/price-title-icon.png" className="p-title__icon"></img>
        </section>
        <section className="l-price">
          <p className="p-price__title">レンタル料金を計算</p>
          <div>
            <form>
              <div className="p-price__desc">
                <div className="p-price__desc--title m-3">
                  <p className="p-price__desc--num">01</p>
                  <p className="p-price__desc--heading">
                    利用する日程を選択してください
                  </p>
                </div>
                <div className="p-price__calendar">
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
                            customHeaderCount === 1
                              ? {
                                  visibility: 'hidden',
                                  margin: 10,
                                  display: 'flex',
                                  justifyContent: 'center',
                                }
                              : {
                                  margin: 10,
                                  display: 'flex',
                                  justifyContent: 'start',
                                }
                          }
                        >
                          <button
                            type="button"
                            className="button-prev"
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                          >
                            {'< 前月'}
                          </button>
                          <span className="react-datepicker__current-year">
                            {monthDate.toLocaleString('ja', {
                              year: 'numeric',
                            })}
                          </span>
                          <button
                            type="button"
                            className="button-next"
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                          >
                            {'翌月 >'}
                          </button>
                        </div>

                        <div className="react-datepicker__current-months">
                          <span className="react-datepicker__current-month">
                            {monthDate.toLocaleString('ja', {
                              month: 'long',
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
                <div className="p-price__desc--title">
                  <p className="p-price__desc--num">02</p>
                  <p className="p-price__desc--heading">
                    車種を選択してください
                  </p>
                </div>
                <div className="p-price__car--list">
                  {/* <div className="p-price__car--item">
                    <div>
                      <img
                        className="p-price__car--img coming-soon"
                        src="/img/comingsoon.png"
                      ></img>
                      <p className="p-price__car--name">coming soon</p>
                    </div>
                  </div> */}
                  <div className="p-price__car--item">
                    <button type="button">
                      <img
                        className="p-price__car--img"
                        src="/img/suzuki-every.png"
                      ></img>
                      <p className="p-price__car--name">スズキエブリィバン4w</p>
                      <img className="p-price__car--checked" src='/img/checked.png' />
                    </button>
                  </div>
                  {/* <div className="p-price__car--item">
                    <div>
                      <img
                        className="p-price__car--img coming-soon"
                        src="/img/comingsoon.png"
                      ></img>
                      <p className="p-price__car--name">coming soon</p>
                    </div>
                  </div> */}
                </div>
              </div>
              <div>
                <div className="p-price__desc--title">
                  <p className="p-price__desc--num">03</p>
                  <p className="p-price__desc--heading">
                    追加オプションを選択してください
                  </p>
                </div>
                <div className="p-price__option--list">
                  {customOptions.map((option, index) => {
                    return (
                      <label
                        htmlFor={`id_${index}`}
                        key={`key_${index}`}
                        className="p-price__option--item"
                      >
                        <CheckBox
                          id={`id_${index}`}
                          // checked={option.checked}
                          // onChange={(e) => handleInputChange(option)}
                          onChange={(e) =>
                            option.name === 'すべて'
                              ? onClickAllCheck(e)
                              : toggleChecked(index)
                          }
                          checked={
                            option.name === 'すべて'
                              ? null
                              : checked.includes(index)
                          }
                          // checked={checkedItems[option.id]}
                        />
                        <p
                          className={
                            option.size == 'small'
                              ? 'text-sm'
                              : option.size == 'medium'
                              ? 'text-md'
                              : ''
                          }
                        >
                          {option.name}
                        </p>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="p-price__desc--title">
                  <p className="p-price__desc--num">04</p>
                  <p className="p-price__desc--heading">
                    自動車保険の加入を選択してください
                  </p>
                </div>
                <div className="p-price__option--list">
                  {insuranceOptions.map((option, index) => {
                    index = index + 1;
                    return (
                      <label
                        htmlFor={`id_ins${index}`}
                        key={`key_ins${index}`}
                        className="p-price__option--item"
                      >
                        <RadioBox
                          id={`id_ins${index}`}
                          checked={checkedInsurance.price === option.price}
                          value={option}
                          onChange={(e) => handleRadioChange(option)}
                          // checked={checkedItems[option.id]}
                        />
                        <p>{option.name}</p>
                      </label>
                    );
                  })}
                </div>
                <p className="text-center p-price__option--term">
                  保険の詳細については<a href="">こちら</a>をご覧ください
                </p>
              </div>
              <div className="p-price__calc text-center">
                <button
                  type="button"
                  disabled={endDate ? false : true}
                  onClick={calcPrice}
                >
                  計算する
                </button>
              </div>
              <div className="p-price__calc-result">
                <p className="p-price__calc-result--title">ご利用料金</p>
                <p className="p-price__calc-result--price">
                  ¥{total.toLocaleString()}
                </p>
                <p className="p-price__calc-result--breakdown">内訳</p>
                <div className="p-price__calc-result--list">
                  <p className="p-price__calc-result--item">
                    <span>基本料金</span>
                    <span>¥{basicPrice.toLocaleString()}</span>
                  </p>
                  <p className="p-price__calc-result--item">
                    <span>オプション</span>
                    <span>¥{optionPrice.toLocaleString()}</span>
                  </p>
                  <p className="p-price__calc-result--item">
                    <span>自動車保険</span>
                    <span>¥{insurancePrice.toLocaleString()}</span>
                  </p>
                  <p className="p-price__calc-result--item">
                    <span>小計</span>
                    <span>¥{subtotal.toLocaleString()}</span>
                  </p>
                  <p className="p-price__calc-result--item">
                    <span>消費税</span>
                    <span>¥{(subtotal * 0.1).toLocaleString()}</span>
                  </p>
                </div>
              </div>
              {/* <div className="p-price__calc-reserv">
                <a
                  href="https://rsvsys-1615.rsvsys.demo.iqnet.co.jp/"
                  target="blank"
                >
                  この内容で予約する
                  <span>→</span>
                </a>
              </div> */}
            </form>
          </div>
        </section>
      <section>
        <img className="bg-wave-down" src="/img/bg-wave-down.png" />
      </section>
      </div>
    </>
  );
};

export default App;
