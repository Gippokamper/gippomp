<?php

namespace App\Traits;

use App\Enums\ResponseError;
use App\Models\User;

trait NotificationTrait
{
    public function sendNotification($user_id, $title, $body)
    {
        try {
            $user = User::find($user_id);
            $notificationTokens = $user->devices->pluck('notification_token')->toArray();
            $url = 'https://fcm.googleapis.com/fcm/send';

            $serverKey = config('services.fcm.server_key');

            foreach ($notificationTokens as $token){
                if (!is_null($token)){
                    $data = [
                        "to" => $token,
                        "notification" => [
                            "title" => $title,
                            "body" => $body,
                        ]
                    ];
                    $encodedData = json_encode($data);

                    $headers = [
                        'Authorization:key=' . $serverKey,
                        'Content-Type: application/json',
                    ];

                    $ch = curl_init();

                    curl_setopt($ch, CURLOPT_URL, $url);
                    curl_setopt($ch, CURLOPT_POST, true);
                    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
                    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
                    // Disabling SSL Certificate support temporarly
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $encodedData);
                    // Execute post
                    $result = curl_exec($ch);
                    if ($result === FALSE) {
                        // Bitta token xato bo'lsa, butun so'rovni to'xtatmaymiz — faqat log qilamiz.
                        \Log::warning('FCM push failed: ' . curl_error($ch));
                    }
                    // Close connection
                    curl_close($ch);
                }
            }
            return back();
        }catch (\Exception $e){
            return $this->errorResponse(ResponseError::ERROR_500->name);
        }
    }
}
