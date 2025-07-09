<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors to users

// Log errors to a file
ini_set('log_errors', 1);
ini_set('error_log', 'mail-errors.log');

// Load Composer's autoloader
require 'vendor/autoload.php';

// Load email configuration
require 'email-config.php';

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Function to send email using PHPMailer with fallback to file storage
function sendContactEmail($name, $email, $phone, $message) {
    // Create a unique filename for backup
    $timestamp = date('Y-m-d_H-i-s');
    $random = substr(md5(rand()), 0, 7);
    $filename = "contact_submissions/{$timestamp}_{$random}.txt";
    
    // Create directory if it doesn't exist
    if (!file_exists('contact_submissions')) {
        mkdir('contact_submissions', 0777, true);
    }
    
    // Format the email content for file backup
    $content = "New Contact Form Submission\n";
    $content .= "==========================\n";
    $content .= "Date: " . date('Y-m-d H:i:s') . "\n";
    $content .= "Name: " . $name . "\n";
    $content .= "Email: " . $email . "\n";
    $content .= "Phone: " . $phone . "\n";
    $content .= "Message:\n" . $message . "\n";
    $content .= "==========================\n";
    
    // Always write to file as backup
    $fileSuccess = file_put_contents($filename, $content);
    
    if ($fileSuccess) {
        error_log("Contact form submission saved to file: $filename");
    } else {
        error_log("Failed to save contact form submission to file");
    }
    
    // Try to send email via SMTP
    try {
        // Create a new PHPMailer instance
        $mail = new PHPMailer(true);
        
        // Server settings
        $mail->SMTPDebug = 0;                      // Enable verbose debug output (0 = off, 2 = detailed)
        $mail->isSMTP();                           // Send using SMTP
        $mail->Host       = SMTP_HOST;             // Set the SMTP server to send through
        $mail->SMTPAuth   = SMTP_AUTH;             // Enable SMTP authentication
        
        // Only set username and password if authentication is required
        if (SMTP_AUTH) {
            $mail->Username   = SMTP_USERNAME;     // SMTP username
            $mail->Password   = SMTP_PASSWORD;     // SMTP password
        }
        
        // Set encryption based on SMTP_SECURE value
        if (SMTP_SECURE === 'tls') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        } elseif (SMTP_SECURE === 'ssl') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        } else {
            // No encryption
            $mail->SMTPSecure = false;
            $mail->SMTPAutoTLS = false;
        }
        
        $mail->Port       = SMTP_PORT;             // TCP port to connect to
        
        // Recipients
        $mail->setFrom(EMAIL_FROM, EMAIL_FROM_NAME); // Sender
        $mail->addAddress(EMAIL_TO, EMAIL_TO_NAME);  // Add a recipient
        $mail->addReplyTo($email, $name);            // Add reply-to address
        
        // Content
        $mail->isHTML(true);                       // Set email format to HTML
        $mail->Subject = 'New Contact Form Submission from ' . $name;
        
        // Email body in HTML format
        $htmlBody = "
        <h2>New Contact Form Submission</h2>
        <p><strong>Date:</strong> " . date('Y-m-d H:i:s') . "</p>
        <p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>
        <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
        <p><strong>Phone:</strong> " . htmlspecialchars($phone) . "</p>
        <p><strong>Message:</strong><br>" . nl2br(htmlspecialchars($message)) . "</p>
        ";
        
        $mail->Body    = $htmlBody;
        $mail->AltBody = strip_tags(str_replace('<br>', "\n", $htmlBody)); // Plain text version
        
        // Send the email
        $mail->send();
        error_log("Email sent successfully to " . EMAIL_TO);
        return true;
    } catch (Exception $e) {
        error_log("PHPMailer Error: {$e->getMessage()}");
        
        // If email sending fails but file was saved, still return true
        // This ensures the user gets a success message even if SMTP fails
        if ($fileSuccess) {
            error_log("Email failed but submission was saved to file. Returning success to user.");
            return true;
        }
        
        return false;
    }
}

// For AJAX requests
if (isset($_POST['ajax']) && $_POST['ajax'] == 'true') {
    header('Content-Type: application/json');
    
    // Check required fields
    if (!isset($_POST['name']) || !isset($_POST['email']) || !isset($_POST['phone']) || !isset($_POST['message'])) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
        exit;
    }
    
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $msg = $_POST['message'];
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
        exit;
    }
    
    // Send email
    $result = sendContactEmail($name, $email, $phone, $msg);
    
    if ($result) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to send email. Please try again later.']);
    }
    exit;
}

// For direct form submissions
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check required fields
    if (!isset($_POST['name']) || !isset($_POST['email']) || !isset($_POST['phone']) || !isset($_POST['message'])) {
        header("Location: contact.html?status=error&message=" . urlencode("All fields are required"));
        exit;
    }
    
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $msg = $_POST['message'];
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: contact.html?status=error&message=" . urlencode("Invalid email format"));
        exit;
    }
    
    // Send email
    $result = sendContactEmail($name, $email, $phone, $msg);
    
    if ($result) {
        header("Location: contact.html?status=success");
    } else {
        header("Location: contact.html?status=error&message=" . urlencode("Failed to send email. Please try again later."));
    }
    exit;
}
?>