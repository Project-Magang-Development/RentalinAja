import React from "react";
import { Skeleton, Card, Col, Row } from "antd";

function CalendarSkeleton() {
  const weekdayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
        {weekdayHeaders.map((day, index) => (
          <Col key={index} span={3}>
            <Card>
              <Skeleton.Input style={{ width: "100%" }} active size="small" />
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[8, 8]}>
        {Array.from({ length: 35 }).map(
          (
            _,
            index 
          ) => (
            <Col key={index} span={3}>
              <Card>
                <Skeleton active paragraph={{ rows: 1 }} />
              </Card>
            </Col>
          )
        )}
      </Row>
    </div>
  );
}

export default CalendarSkeleton;
