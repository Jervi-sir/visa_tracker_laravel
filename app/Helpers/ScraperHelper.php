<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;
use App\Models\User;
use App\Models\Website;
use DOMDocument;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Symfony\Component\DomCrawler\Crawler;

class ScraperHelper
{
  public function __construct()
  {
  }

  /*
  | BLS Website of Spain
  |--------------------------------------------------------------------------
  | it check if the site contains a class
  */
  public function isBLSOpen($url = null)
  {
    $client = new Client([
      'timeout' => 10,
      'verify' => false // Only if you need to bypass SSL verification
    ]);

    if($url === null) {
      $url = Website::where('used_function', 'BLSWebsite')->first()->url;
    }

    try {
      // Fetch the webpage content
      $response = $client->get($url);

      // Ensure the response is successful
      if ($response->getStatusCode() !== 200) {
        return false; // Page not accessible
      }

      // Get the body of the response
      $html = $response->getBody()->getContents();

      // Use DomCrawler to parse the HTML
      $dom = new DOMDocument();
      // Suppress warnings for malformed HTML
      libxml_use_internal_errors(true);
      $dom->loadHTML($html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
      libxml_clear_errors();
      // Find elements with class "alert alert-danger"
      $finder = new \DOMXPath($dom);
      $alerts = $finder->query("//*[contains(@class, 'alert alert-danger')]");
      // Prepare response
      $result = [
        'found' => $alerts->length > 0,
        'count' => $alerts->length,
        'elements' => []
      ];

      // Get alert contents if found
      if ($alerts->length > 0) {
        foreach ($alerts as $alert) {
          $result['elements'][] = [
            'text' => trim($alert->textContent),
            'html' => $dom->saveHTML($alert)
          ];
        }
      }
    
      return  !($alerts->length > 0); 
    } catch (\Exception $e) {
      // Log the error or handle it as needed
      Log::error('Error fetching the webpage: ' . $e->getMessage());
      return false; // In case of error
    }

  }
}
