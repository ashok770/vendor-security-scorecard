import sys
import json
import requests
import dns.resolver

def check_security_headers(domain):
    url = f"https://{domain}"
    try:
        response = requests.get(url, timeout=5, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) VendorSecurityScorecard/1.0"})
        headers = response.headers
        
        target_headers = {
            "Strict-Transport-Security": "Missing (Vulnerable to MITM / Protocol Downgrades)",
            "Content-Security-Policy": "Missing (Vulnerable to XSS / Data Injection)",
            "X-Frame-Options": "Missing (Vulnerable to Clickjacking)",
            "X-Content-Type-Options": "Missing (MIME-Sniffing vulnerability)"
        }
        
        header_results = {}
        for header, fallback_msg in target_headers.items():
            if header in headers:
                header_results[header] = {"status": "Secure", "value": headers[header]}
            else:
                header_results[header] = {"status": "Vulnerable", "value": fallback_msg}
        return header_results
    except Exception as e:
        return {"error": f"Failed to connect to HTTP/S web server: {str(e)}"}

def check_dns_security(domain):
    dns_results = {
        "SPF": {"status": "Missing", "record": None},
        "DMARC": {"status": "Missing", "record": None}
    }
    try:
        txt_records = dns.resolver.resolve(domain, 'TXT')
        for record in txt_records:
            record_text = record.to_text().strip('"')
            if record_text.startswith("v=spf1"):
                dns_results["SPF"] = {"status": "Configured", "record": record_text}
                break
    except Exception:
        pass
        
    try:
        dmarc_records = dns.resolver.resolve(f"_dmarc.{domain}", 'TXT')
        for record in dmarc_records:
            record_text = record.to_text().strip('"')
            if record_text.startswith("v=DMARC1"):
                dns_results["DMARC"] = {"status": "Configured", "record": record_text}
                break
    except Exception:
        pass
        
    return dns_results

def calculate_score(headers, dns_sec):
    """Calculates a defensive security rating from 0-100 and maps it to a letter grade."""
    score = 100
    
    # If connection failed completely, we can't score it fairly
    if "error" in headers:
        return {"numeric_score": 0, "grade": "F", "notes": "Host unreachable"}

    # Deductions for missing headers (Weighted based on severity)
    if headers["Strict-Transport-Security"]["status"] == "Vulnerable":
        score -= 20  # Critical for preventing MITM
    if headers["Content-Security-Policy"]["status"] == "Vulnerable":
        score -= 25  # High risk for XSS
    if headers["X-Frame-Options"]["status"] == "Vulnerable":
        score -= 15  # Medium risk for clickjacking
    if headers["X-Content-Type-Options"]["status"] == "Vulnerable":
        score -= 10  # Low risk

    # Deductions for missing email infrastructure security
    if dns_sec["SPF"]["status"] == "Missing":
        score -= 15  # High risk for domain spoofing/phishing
    if dns_sec["DMARC"]["status"] == "Missing":
        score -= 15  # High risk for email spoofing enforcement

    # Keep score bounded between 0 and 100
    score = max(0, score)

    # Map score to a classic cybersecurity maturity letter grade
    if score >= 90: grade = "A"
    elif score >= 80: grade = "B"
    elif score >= 70: grade = "C"
    elif score >= 60: grade = "D"
    else: grade = "F"

    return {"numeric_score": score, "grade": grade}

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python core_scanner.py <domain>"}, indent=4))
        sys.exit(1)
        
    target_domain = sys.argv[1]
    
    header_report = check_security_headers(target_domain)
    dns_report = check_dns_security(target_domain)
    score_report = calculate_score(header_report, dns_report)
    
    final_scorecard = {
        "domain": target_domain,
        "rating": score_report,
        "security_headers": header_report,
        "dns_security": dns_report
    }
    
    print(json.dumps(final_scorecard, indent=4))

if __name__ == "__main__":
    main()