import Image from 'next/image';
// import Link from "next/link";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import React, {useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { addSelectedFlightActions, resetStatusActions } from '@/redux/ticketSlice/allTicketsActions';
import { createBookingOrderActions } from '@/redux/ticketSlice/allBookingActions';
import { getFullDayTime } from '@/lib/utils/helpers';
import { CloseIcon } from './icons/SvgIconAssests';
import { toggleFoundFlightActions } from '@/redux/toggleSlice/toggleActions';
import type { FlightsInitials, CreateOrderInitials } from '@/lib/types/MyTypes';



export default function FoundNewFlightLists(){
    const {loading,selectedFlight, errorMessage, status, ticketsDetails, foundNewFlights} = useSelector((state: RootState) => state.allTickets);
    const {userSession} = useSelector((state: RootState) => state.authUsers);
    const {cheapRecommendedFlights, foundFlights} = foundNewFlights;
    const {toggleFoundFlights} = useSelector((state: RootState) => state.toggleHomeMenu);
    const { bookingOrder} = useSelector((state: RootState) => state.allBooking);
    const {orderStatus, orderMessage, orderError, order} = bookingOrder;

    console.log(bookingOrder);

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    console.log("before booking selected ticket ===>", status, " new selected ticket", ticketsDetails);

    const bookSelectedFlight = (flight:FlightsInitials)=>{
        const newBooking ={
         user: userSession.userId,
         flight 
        }
       dispatch(addSelectedFlightActions(newBooking));
    }

    useEffect(() => {
        if(selectedFlight && status === 200){
            console.log("datA  was booked so wait a mooment")
            const makeBookingOrder:CreateOrderInitials =  {
                ticketId: ticketsDetails && ticketsDetails._id,
                userId: ticketsDetails && ticketsDetails.user
            } 
            dispatch(createBookingOrderActions(makeBookingOrder));
            //resett status
            dispatch(resetStatusActions(status))
        }
        if(orderStatus === 200){
            console.log("you can now push the router")
            // push route to boooking details
            router.push(`${process.env.BASE_URL}/bookings/orders/order_details/${order._id}`); 
        }
        
    }, [dispatch, router, toggleFoundFlights, loading, ticketsDetails, selectedFlight, status, orderStatus, order._id]);
     
    return (
            <div className="bg-red-600 relative  p-10 rounded-md -top-4
               xl:min-w-[900px]  x2l:min-w-[900px]
               flex-1 h-screen overflow-y-auto
              "
            >
                <div className=" flex items-center justify-between pb-6">
                    <div className="flex flex-col">
                        <h2 className="text-blue-900 font-semibold">Found Flights</h2>
                        <span className="text-xs"><span className="mr-1">{foundFlights !== null && foundFlights.length}</span>Found Flights</span>
                    </div>
                    <div className="bg-red-600 relative -left-5 -top-2">
                        <button
                          onClick={() => dispatch(toggleFoundFlightActions(toggleFoundFlights))}
                          className="bg-sky-300 rounded-3xl fixed">
                            <CloseIcon/>
                        </button>
                    </div>
                </div>
                <div>
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                              {/*table head  */}
                                <thead>
                                    <tr>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Airline or Flight No.
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Departure and Destination
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Travel Date and Time
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Prices and Transfers
                                        </th>                                       
                                    </tr>
                                </thead>
                                {/* table body */}
                                <tbody className=" p-3 m-5">
                                   <tr className="relative my-5 p-3 bg-red-600  text-white tr-1x  first-letter:flex flex-row justify-center h-max w-[100vw]"> 
                                        <th className="flex flex-row w-full p-3">
                                           {
                                             foundFlights === null? 
                                              "sorry we could not find flight matching your request, check below are recommendated flights": 
                                               "Flights matched your search"
                                            }
                                        </th>
                                    </tr>
                                    {
                                      foundFlights && foundFlights.map((el, i)=>{
                                        return(
                                            <tr className=" p-5" key={i}>
                                                <td className="px-5 className=  border-b border-gray-200 bg-white text-sm">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 w-10 h-10">
                                                        
                                                        </div>
                                                            <div className="ml-3">
                                                                <p className="text-gray-900 whitespace-no-wrap">
                                                                <span className="bg-sky-200 p-1">{el && el[1].airline} </span> 
                                                                Number: <span className="bg-sky-200 p-1">{el && el[1].flight_number} </span> 
                                                                </p>
                                                            </div>
                                                        </div>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="flex m-w-56 flex-col text-gray-900 whitespace-no-wrap">
                                                    <span>Departure: {el && el[1].origin}</span>
                                                    <span>Destination : {el && el[1].destination}</span>
                                                    </p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                    <span>Departure Time:  {el && getFullDayTime(el[1].departure_at)}</span>
                                                    <span> Return Time : {el && getFullDayTime(el[1].return_at)}</span>
                                                    </p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                    <span>Price: {el && el[1].price}</span> USD
                                                    <span>Transfers: {el && el[1].transfers}</span>
                                                    </p>
                                                    <div className="flex flex-col text-black ">
                                                       <button className="bg-sky-300 k px-2  m-1 rounded-2xl">
                                                            view details
                                                        </button>
                                                        <button 
                                                            onClick={() => bookSelectedFlight(el)}
                                                            className="bg-red-600 hover:bg-sky-300 hover:text-black text-white m-1 rounded-2xl py px-2">
                                                            book flight
                                                        </button>
                                                 </div>
                                                </td>  
                                            </tr> 
                                        )
                                      })
                                    }


                                    {/* chaep recommended prices */}
                                    <tr className="relative bg-sky-300 text-white p-3 flex flex-row justify-center h-24 w-[100%]"> 
                                         <td>
                                            <span className="">
                                              Flights recommended for you
                                            </span>
                                         </td>
                                    </tr>
                                    {
                                       cheapRecommendedFlights && cheapRecommendedFlights.map((el, i)=>{
                                        return(
                                            <tr className=" p-5" key={i}>
                                            <td className="px-5 className=  border-b border-gray-200 bg-white text-sm">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 w-10 h-10">
                                                      
                                                    </div>
                                                        <div className="ml-3">
                                                            <p className="text-gray-900 whitespace-no-wrap">
                                                              <span className="bg-sky-200 p-1">{el && el.airline} </span> 
                                                              Number: <span className="bg-sky-200 p-1">{el && el.flight_number} </span> 
                                                            </p>
                                                        </div>
                                                    </div>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="flex m-w-56 flex-col text-gray-900 whitespace-no-wrap">
                                                   <span>Departure: {el && el.origin}</span>
                                                   <span>Destination : {el && el.destination}</span>
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                   <span>Departure Time: {el && getFullDayTime(el.departure_at)}</span>
                                                   <span> Return Time : {el &&  getFullDayTime(el.return_at)}</span>
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                   <span>Price: {el && el.price}</span> USD
                                                   <span>Transfers: {el && el.transfers}</span>
                                                </p>
                                                 <div className="flex flex-col text-black ">
                                                       <button className="bg-sky-300 k px-2  m-1 rounded-2xl">
                                                            view details
                                                        </button>
                                                        <button 
                                                            onClick={() => bookSelectedFlight(el)}
                                                            className="bg-red-600 hover:bg-sky-300 hover:text-black text-white m-1 rounded-2xl py px-2">
                                                            book flight
                                                        </button>
                                                 </div>
                                            </td>  
                                            </tr> 
                                         )
                                       })  
                                    }
                              
                                </tbody>
                            </table>

                            {/* content impliment pagination
                            */}
                            <div
                                className="px-5 relative -top-4 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                                <span className="text-xs xs:text-sm text-gray-900">
                                    Showing 1 to 4 of 50 Entries
                                </span>
                                <div className="inline-flex mt-2 xs:mt-0">
                                    <button
                                        className="text-sm text-indigo-50 transition duration-150 hover:bg-sky-300 bg-red-600 font-semibold py-2 px-4 rounded-l">
                                        Prev
                                    </button>
                                    &nbsp; &nbsp;
                                    <button
                                        className="text-sm text-indigo-50 transition duration-150 hover:bg-sky-300 bg-red-600 font-semibold py-2 px-4 rounded-r">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
      
  )

}