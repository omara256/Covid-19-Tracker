import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core';
import "./infoBox.css";

function InfoBox({ title, cases, isRed, active, total, ...props }) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} 
            ${ isRed && "infoBox--red" }`}>
            <CardContent>
                {/* Title CoronaVirus cases */}
                <Typography className="infoBox__Title" color="textSecondary">{title}</Typography>

                {/* +120 number of cases */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>

                {/* 1.2M Total */}
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
