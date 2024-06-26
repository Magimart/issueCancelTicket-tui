"use client"
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import React, {useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getTicketDetailsAction } from "@/redux/ticketSlice/allTicketsActions";
import { CalenderIcon, EuroCurrencyIcon } from "@/components/headerComponents/icons/SvgIconAssests";
import AdjustBookingInfo from "@/components/headerComponents/AdjustTicketDetails";
import { toggleBookingInfoActions, toggleFoundFlightActions } from "@/redux/toggleSlice/toggleActions";
import axios from "axios";
import FoundFlights from "@/components/headerComponents/FoundFlights";
import { LoggedInUserAction } from "@/redux/userSlice/authUsersActions";
import { changeBookingActions, resetCancelStatusAction } from "@/redux/ticketSlice/allBookingActions";
// import type { BookingInitials} from "@/lib/types/MyTypes";
import SuccessMessageToggle from "@/components/sharedComponents/SuccessMessageToggle";



type Params = {
  params : {id: string}
}


export default function TicketiDetailsPage({params : {id}}: Params) {

  const {loading, ticketsDetails,errorMessage, status, foundNewFlights} = useSelector((state: RootState) => state.allTickets);
  const {userSession} = useSelector((state: RootState) => state.authUsers);
  const {userName} = userSession;
  const {toggleBooking} = useSelector((state: RootState) => state.toggleHomeMenu);
  const {cheapRecommendedFlights, foundFlights} = foundNewFlights
  const {toggleFoundFlights} = useSelector((state: RootState) => state.toggleHomeMenu);
  const [userTicketId, setUserTicketId ] = useState<{user: string, ticket: Object}>({user: "", ticket: {}});
  const {cancelStatus, cancelMessage} = useSelector((state: RootState) => state.allBooking);
  const { toggleSuccessMessage} = useSelector((state: RootState) => state.toggleHomeMenu);
  const {bookingOrder} = useSelector((state: RootState) => state.allBooking);
  const {orderStatus, orderMessage, orderError, order} = bookingOrder;
  const {transactions, ticket} = order;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const ref = useRef(false);
  const {
    _id,  airlineName, departure, departureTime, numberOfTransfers,
    flightNumber,destination, arrivalTime, costPrice, ticketStatus, user,
    createdAt 
  } = ticketsDetails;

  
    const getId = () =>{
      const cancelTicket = {
        cancel: true,
        user: userSession.userId,
        ticketsDetails
      } 
      dispatch(changeBookingActions(cancelTicket))
    }

    const handleToggleRemoveDiv =() => {
      dispatch(toggleBookingInfoActions(toggleBooking))
      dispatch(resetCancelStatusAction(cancelStatus))
    }

  useEffect(() => {
    if (ref.current === false) {  
    dispatch(getTicketDetailsAction(id));
    dispatch(LoggedInUserAction());
    }
    return () => {
      ref.current = true;
      if(cheapRecommendedFlights && cheapRecommendedFlights.length){
        //dispatch(toggleFoundFlightActions(toggleFoundFlights))
      }
      
    };
  }, [dispatch, cheapRecommendedFlights, toggleFoundFlights, id, userName, loading, ticketsDetails]);

    return (
      <main className={`singlePageWraper z-0 
        ${toggleBooking && toggleBooking?"fixed h-screen w-screen":"relative w-full h-auto"}
        ${cancelStatus && cancelStatus?"fixed":""}
        md:flex  overflow-hidden" p-0 m-0  left-0  flex items-center  `}
      >        
        <div className="adjustBookingWrapper  w-full h-autog flex flex-row justify-end top-0 right-0 absolute  ">
          {
            toggleBooking && <AdjustBookingInfo/>
          }
        </div>
        <div className={`adjustBookingWrapper absolute ${ cheapRecommendedFlights && cheapRecommendedFlights.length? "w-[98vw] h-screen":""}  w-fullx !! flex flex-row justify-start top-0 left-0  `}>
          {
            toggleFoundFlights? <FoundFlights/>:""
          }
        </div>
        {/* successfully cancelled */}
        {
          cancelStatus && cancelStatus === 200? (
          <div className="absolute bg-gradient-to-b from-transprent via-sky-200 to-sky-400 text-white 
               flex  flex-col justify-center items-center w-[100%] bg-white bg-opacity-90 h-screen top-0 z-1 left-0">
              <div className="w-fullk m-6">
                 {
                   !toggleSuccessMessage && <SuccessMessageToggle/>
                 }
                  
              </div>
              <div className="bg-sky-500 w-full flex space-x-6 items-center justify-center min-h-[20em] flex-row">
                   <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row 2xl:flex-row items-center  space-x-7">
                      <button 
                            // onClick={()=>dispatch(toggleBookingInfoActions(toggleBooking))}
                            onClick={()=> handleToggleRemoveDiv()}

                            className="mt-6 text-base  text-white flex-row px-6 flex justify-center items-center bg-red-600 rounded-3xl
                            leading-7"
                          > 
                            <span className="font-semibold mx-3">Book new flight</span> 
                              <span
                                className="bg-black-  bg-opacity-20 rounded-lg hover:white cursor-pointer "
                              >
                               <CalenderIcon/>
                            </span>
                         </button> 
                         <span className="text-black font-bold h-12 flex items-center">or</span>
                         <button 
                            disabled={true}
                            onClick={()=>dispatch(toggleBookingInfoActions(toggleBooking))}
                            className="mt-6 opacity-30 text-base  text-white flex-row px-6 flex justify-center items-center bg-red-600 rounded-3xl
                            leading-7"
                          > 
                            <span className="font-semibold mx-3">Claim for refund</span> 
                              <span
                                className="bg-black-  bg-opacity-20 rounded-lg hover:white cursor-pointer "
                              >
                               <EuroCurrencyIcon/>
                            </span>
                         </button> 
                        
                    </div> 
                   <div className="">
                    </div> 
              </div>
             </div>
          ): ""
        }

        <div className="relative top-24 
          flex flex-rowxl flex-col 
          2xl:min-h-[20vh] 
          h-[32%] sm:h-[60%]   md:h-[60%]  md:lg:h-[60%]  lg:h-[60%]  xl:h-[82%]  2xl:xl:h-[82%] 
          w-[100vw] text-white bg-sky-300"          
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
            </div>
            <div className="relative -z-0 mt-16 w-full rounded-3xl ring-1 ring-red-600 
               sm:mt-20 
               bg-gradient-to-b from-transparent via-sky-50 to-sky-300
              "
            >
              <div className="relative  p-8 sm:p-10 ">
                <h3 className="text-2xl font-bold tracking-tight text-blue-900">With Tui 4 U cancellations and adjustments are made with ease</h3>
                <div className="relative  text-base flex flex-col space-x-4">
                  <div className="mt-6 text-gray-600">
                      <span className="font-semibold">Booking Number</span>:
                       {_id.toLocaleUpperCase()} 
                       {toggleFoundFlights} 
                      {/*  RETRUN SUCCESS MSG TO USER */}
                      {/* Add refund button incase */}
                      {
                        cancelStatus && cancelStatus === 200?("")
                       :(
                          // cancle flight
                          <button 
                            onClick={() => getId()}
                            className=" text-lg  text-white flexl justify-center items-center bg-red-600 rounded-3xl
                            leading-7  px-4
                            "
                          >
                            cancel flight                          
                          </button> 
                        )
                      }
                  </div>
                    
                  <h4 className="mt-6  leading-7 text-gray-600">
                    <span className="font-semibold">Name</span>: {userName}
                  </h4>
                  <h4 className="mt-6 flex
                    leading-7 text-gray-600"
                  >
                    <span>
                    <svg className="svg-icon h-5" fill="red" viewBox="0 0 20 20">
                      <path d="M10,1.375c-3.17,0-5.75,2.548-5.75,5.682c0,6.685,5.259,11.276,5.483,11.469c0.152,0.132,0.382,0.132,0.534,0c0.224-0.193,5.481-4.784,5.483-11.469C15.75,3.923,13.171,1.375,10,1.375 M10,17.653c-1.064-1.024-4.929-5.127-4.929-10.596c0-2.68,2.212-4.861,4.929-4.861s4.929,2.181,4.929,4.861C14.927,12.518,11.063,16.627,10,17.653 M10,3.839c-1.815,0-3.286,1.47-3.286,3.286s1.47,3.286,3.286,3.286s3.286-1.47,3.286-3.286S11.815,3.839,10,3.839 M10,9.589c-1.359,0-2.464-1.105-2.464-2.464S8.641,4.661,10,4.661s2.464,1.105,2.464,2.464S11.359,9.589,10,9.589"></path>
                    </svg>
                    </span>
                    <span className="font-semibold"> Departing From
                        <span className="font-normal">(s)</span></span>:
                        {departure}
                      <span>
                      </span>
                  </h4>
                  <h4 className="mt-6 leading-7 text-gray-600">
                    <span className="font-semibold">Price</span>: {costPrice.price}
                      <span className="font-normal pl-1">{costPrice.currency}</span>
                  </h4> 
                  <h4 className="mt-6 leading-7 text-gray-600">
                    <span className="font-semibold">Airlines</span>: {airlineName}
                  </h4>
                </div>

                {/* row 2 */}
                <div className="relative text-xs font-semibold flex flex-col space-x-4">
                  <h4 className="flex mt-6 items-center
                    leading-7 text-gray-600"
                  >                      
                    <span className="pl-l"> Number of transfer
                      <span className="font-normal">(s)</span>
                      </span >: <span className="flex flex-row">

                      {/* {
                        numberOfTransfers.
                        map((el, i)=>{
                          return(
                            <span key={el}
                              className="relative flex flex-row">
                                <p>
                                  {`${i+1}`}: <span className="mr-1 font-bold">{el}</span>
                                </p>
                            </span>
                          )
                        })
                      }                         */}
                      </span>
                  </h4>
                  <h4 className="mt-6 flex items-center
                    leading-7 text-gray-600"
                  >
                    <span className="font-semibold"> 
                        Number of Transfers<span className="font-normal">(s)
                    </span>
                  </span>: {numberOfTransfers}
                  </h4>
                </div>
                {/* row 3 */}
                <div className="mt-10 flex items-center gap-x-4">
                  <h4 className="flex-none text-blue-900 text-sm font-semibold leading-6 ">
                    What would you like to do?
                  </h4>
                  <div className="h-px flex-auto bg-red-400"></div>
                </div>
                  <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6">
                    <li className="flex gap-x-3">
                      <svg className="h-6 w-5 flex-none text-red-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Check out for our fund policies
                    </li>
                    <li className="flex gap-x-3">
                      <svg className="h-6 w-5 flex-none text-red-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      availlabity insights for vacations
                    </li>
                    <li className="flex gap-x-3">
                      <svg className="h-6 w-5 flex-none text-red-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      missed flights
                    </li>
                    <li className="flex gap-x-3">
                      <svg className="h-6 w-5 flex-none text-red-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      Lost travel documents
                    </li>
                  </ul>
              </div>
              {/* row 4 */}
              <div className="relative z-2 -mt-2 p-2 lg:mt-0 lg:w-full
                bg-gradient-to-b from-sky-transparent via-sky-200 to-sky-300
              "
              >
              <div className=" z-0d rounded-b-3xl bg--400 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-row lg:justify-centerx lg:py-16">
                <div className="mx-auto max-w-lg px-8">
                  <p className="mt-6 flex items-baseline justify-center gap-x-2">
                    <span className="text-xl font-bold tracking-tight text-gray-900">Toll free</span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">0001800 000</span>
                  </p>
                  <a href="#" className="mt-10 block w-full rounded-3xl bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white
                    shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 
                    focus-visible:outline-offset-2 focus-visible:outline-red-600">
                      Call us
                  </a>
                  <p className="mt-6 text-xs leading-5 text-gray-600">Please terms and conditions for ticket adjustments and cancellations</p>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </main>    
    )
}




