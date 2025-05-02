import { useEffect, useState } from "react"
import { Chart } from "primereact/chart";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { dataCount } from "../utils/ChartData";
import { getImage } from "../utils/Function";

function Dashboard() {
    const [baptismChartData, setBaptismChartData] = useState({});
    const [WFBChartData, setWFBChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const [ count, setCountData] = useState([]);

    const load = async() => {
        try {
            const fetchData = await dataCount();
            setCountData(fetchData.count);

            const documentStyle = getComputedStyle(document.documentElement);
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
            
            const baptism = {
                labels: fetchData.baptism[0].label,
                datasets: [
                    {
                        backgroundColor: fetchData.baptism[0].backgroundColor,
                        data: fetchData.baptism[0].value
                    },
    
                ]
            };

            const wfb = {
                labels: fetchData.wfb[0].label,
                datasets: [
                    {
                        backgroundColor: fetchData.wfb[0].backgroundColor,
                        data: fetchData.wfb[0].value
                    },
    
                ]
            };
            
            const options = {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                            font: {
                                weight: 500
                            }
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    }
                }
            };
    
            setBaptismChartData(baptism);
            setWFBChartData(wfb);
            setChartOptions(options);

        } catch (err) {
            console.error('Failed to load data:', err);
        }
    }

    const headerTemplate = (e) => {

        return (
            <div className="p-panel-header justify-content-space-between py-3">
                <div className="flex align-items-center gap-2">
                    <span className="text-xl font-bold">{e}</span>
                </div>
            </div>
        );
    };

    useEffect(() => {
        load();
        
        

       
    },[])

    return (

        <div className="grid align-items-center">

            { count.map((element,index) => (
                <div className="col-12 md:col-6 xl:col-3 " key={index}>
                    <div className="cards h-full flex px-5 flex-wrap ">
                        <div className=" flex mb-3 align-items-center  gap-5 px-1">
                            <span>{getImage(element.label)}</span>
                            <div className="flex flex-column">
                                <span className="mb-2 font-semibold text-lg">{element.label}</span>
                                <p className="font-semibold text-4xl m-0">{element.value}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )) }

            <div className="col-12 md:col-6 xl:col-6">
                <div className="cards p-5 ">
                    <span className="text-lg font-bold">Baptism</span>
                    <Divider/>
                    <Chart type="bar" data={baptismChartData} options={chartOptions}/>
                </div>  
            </div>  
            
            <div className="col-12 md:col-6 xl:col-6">
                <div className="cards p-5 ">
                    <span className="text-lg font-bold">WFB</span>
                    <Divider/>
                    <Chart type="bar" data={WFBChartData} options={chartOptions}/>
                </div>  
            </div>  

            <div className="col-12 md:col-6 xl:col-6">
                <div className="cards p-5 ">
                    <span className="text-lg font-bold">WFB</span>
                    <Divider/>
                    <Chart type="bar" data={WFBChartData} options={chartOptions}/>
                </div>  
            </div>  

            <div className="col-12 md:col-6 xl:col-6">
                <div className="cards p-5 ">
                    <span className="text-lg font-bold">WFB</span>
                    <Divider/>
                    <Chart type="bar" data={WFBChartData} options={chartOptions}/>
                </div>  
            </div>  
            
        </div>
    )
}

export default Dashboard
