<?php
$postData = file_get_contents('php://input');
// debug
// $data = json_decode($postData);
// var_dump($data);

/* <html>
// <body>
//   <p><b>Name:</b> <?= $data->{'name'} ?></p>
//   <p><b>Email:</b> <?= $data->{'email'} ?></p>
//   <p><b>Message:</b> <?= $data->{'message'} ?></p>
// </body>
// </html>
*/

$url = "https://vq90fjymr9.execute-api.eu-west-1.amazonaws.com/Prod/contact-us";    

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER,
        array("Content-type: application/json"));
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $postData);

$json_response = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$succcessfulResponseCodes = [200, 201, 202, 203];
if (!in_array($status, $succcessfulResponseCodes)) {
  die("Error: $json_response");
}
curl_close($curl);

// $response = json_decode($json_response, true);
echo $json_response;
?>