router.post('/create-order', async (req,res)=>{
    const { plan_id } = req.body;
    const [[plan]] = await pool.query('SELECT * FROM planes_suscripcion WHERE id_plan=?', [plan_id]);
  
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent:'CAPTURE',
      purchase_units:[{
        amount:{ currency_code:'USD', value: plan.precio.toString() },
        description:`Suscripción DJShop – ${plan.nombre}`
      }]
    });
    const order = await paypalClient.execute(request);
    res.json({ id: order.result.id });
  });
  
  router.post('/capture/:orderId', async (req,res)=>{
    const { orderId } = req.params;
    await paypalClient.execute(new paypal.orders.OrdersCaptureRequest(orderId));
  
    // ← aquí insertas en `pagos` y activas suscripción (tokens_restantes = plan.tokens)
    // …
  
    res.json({ message:'Pago confirmado' });
  });
  