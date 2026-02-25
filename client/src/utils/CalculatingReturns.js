export function calculateActualReturn (events) {
    const sum =
      events?.reduce((result, e) => {
        if (e.type === "Return") {
          return result + Number(e.amount);
        }
        return result;
      }, 0) || 0;

    return Number(sum.toFixed(2));
  };

 