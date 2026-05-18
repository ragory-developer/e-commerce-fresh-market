export {};

async function run() {
  const payload = {
    items: [{ productId: "cmn71e1da000tftlyigvsp224", quantity: 1, price: 2349 }] // Shiseido Fino
  };
  const res = await fetch('http://localhost:5000/api/orders/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

run();
