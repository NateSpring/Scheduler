import React from "react";
import { Card, CardBody } from "@windmill/react-ui";

function InfoCard({ title, status, children: icon }) {
  return (
    <Card>
      <CardBody
        className={`flex flex-col text-center items-center  ${status.bg}`}
      >
        {icon}
        <div>
          <p className="mb-2 text-2xl font-bold font-medium text-white dark:text-gray-600">
            {title}
          </p>
          <p className="text-md font-semibold text-white dark:text-gray-600">
            Status: {status.status}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

export default InfoCard;
