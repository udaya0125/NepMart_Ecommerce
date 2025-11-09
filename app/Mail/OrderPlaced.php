<?php

namespace App\Mail;

use App\Models\OrderProduct;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderPlaced extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    public function __construct(OrderProduct $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        return $this->subject('Order Confirmation - ' . $this->order->order_id)
                    ->view('emails.order-placed');
    }
}