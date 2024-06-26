import dbConnect from '@/lib/dbConnect';
import { NextResponse, } from 'next/server';
import axios from 'axios';
interface FlightSearch{
  origin: string;
  destination: string;
  departDate: Date;
  returnDate:Date
}
export  async function POST(req: Request, res: Response) {
  try {
    const { method } = req;
     await dbConnect()
      
    if(method !== "POST") {return}else{
      try {
        const search:FlightSearch = await req.json();
        const {
          origin, destination, departDate, returnDate
        } = search 

        // to b imlemented with a new Api resource
        // get flichts as per user query
        const availableFlights:any = await fetch(`https://api.travelpayouts.com/v1/prices/cheap?origin=${origin}&destination=${destination}&depart_date=${departDate}&return_date=${returnDate}&currency=USD&token=${process.env.TRAVEL_PAYOUT_TOKEN}`)
        const available = await availableFlights.json();
        const cheapestPrices:any = await axios.get(`https://api.travelpayouts.com/v1/prices/monthly?origin=${origin}&destination=${destination}&currency=USD&token=${process.env.TRAVEL_PAYOUT_TOKEN}`)
        .then(function(response){
           return response.data;
        }); 
       
        let isObj = {
          foundFlights: available,
          recommendedPrices:cheapestPrices
        } as any;

        let response =  new NextResponse(JSON.stringify(isObj), {status:200});                   
        res =  response;
        //console.log(res)
        return res;  
      } catch (error) {
          return new NextResponse("we are not able t0 find flights at this time my you adjust your dates" + error, {status: 500})
      }
    };
  } catch (error) {
      console.log(error)
  }
 
}