import axios from "axios";

const form = document.querySelector("form")!; // null값이 아니라는 것을 ts에 알려줌
const addressIntput = document.getElementById("address")! as HTMLInputElement; // value에 접근하기 위해 html element라는걸 명시함
const GOOGLE_API_KEY = process.env.GOOGLE_API;

const searchAddressHandler = (event: Event) => {
  event.preventDefault();
  const enteredAddress = addressIntput.value;

  // ts가 응답타입을 예상할 수 있도록 함
  type GoogleGeocodingResponse = {
    results: { geometry: { location: { lat: number; lng: number } } }[];
    status: "OK" | "ZERO_RESULTS";
  };

  // send this to Google api
  // 서드파티 쓰기 싫으면 fetch 사용 가능
  // ts 프로젝트에서 axios 사용해보기
  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    )
    .then((res) => {
      if (res.data.status !== "OK") {
        throw new Error("Could not fetch location!");
      }
      const coordinates = res.data.results[0].geometry.location;
      console.log(coordinates);
      const map = new google.maps.Map(
        document.getElementById("map")! as HTMLElement,
        {
          center: coordinates,
          zoom: 8,
        }
      );
      new google.maps.Marker({
        map: map,
        position: coordinates,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// submit 이벤트가 발생할 때 마다 함수 실행
form.addEventListener("submit", searchAddressHandler);
