import sys
import json
import socket
import requests
import dns.resolver
import shodan

# Shodan API Key for automated infrastructure intelligence
SHODAN_API_KEY = "16L4Ka5hxOc7Wi2R9306siLMIErdFx3b"

def check_security_headers(domain):
    url = f"https://{domain}"
    try:
        response = requests.get(url, timeout=5, headers={"User-Agent": "Mozilla/5.0 VendorSecurityScorecard/1.0"})
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
                # Truncate long header strings (like massive CSP configurations) to protect UI/DB formatting
                header_results[header] = {"status": "Secure", "value": headers[header][:150]}
            else:
                header_results[header] = {"status": "Vulnerable", "value": fallback_msg}
        return header_results
    except Exception as e:
        return {"error": f"Failed to connect to web server: {str(e)}"}

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

def query_shodan_intelligence(domain):
    """Resolves target hostname to a public IP and gathers open ports/CVE details via Shodan API."""
    intel = {
        "ip_address": "Unknown",
        "open_ports": [],
        "vulnerabilities": [],
        "isp": "Unknown"
    }
    
    try:
        # Resolve domain to an IP address using standard system sockets
        ip_address = socket.gethostbyname(domain)
        intel["ip_address"] = ip_address
    except Exception:
        return intel # Return defaults if DNS resolution completely fails

    if not SHODAN_API_KEY or SHODAN_API_KEY == "16L4Ka5hzOc7Wi2r9306siLMiELdFx3b":
        return intel

    try:
        # Initialize Shodan client and perform host lookups
        api = shodan.Shodan(SHODAN_API_KEY)
        host_info = api.host(ip_address)
        
        intel["open_ports"] = host_info.get('ports', [])
        intel["isp"] = host_info.get('isp', 'Unknown')
        
        # Pull publicly indexed CVE exploits if present
        if 'vulns' in host_info:
            intel["vulnerabilities"] = host_info['vulns']
            
    except Exception:
        pass # Gracefully fall back if the IP address isn't indexed by Shodan or API limit is reached
        
    return intel

def calculate_score(headers, dns_sec, shodan_intel):
    """Calculates defensive security rating from 0-100 factoring both configuration and network architecture."""
    score = 100
    
    if "error" in headers:
        return {"numeric_score": 0, "grade": "F", "notes": "Host unreachable"}

    # Configurations Deductions
    if headers["Strict-Transport-Security"]["status"] == "Vulnerable": score -= 20
    if headers["Content-Security-Policy"]["status"] == "Vulnerable": score -= 25
    if headers["X-Frame-Options"]["status"] == "Vulnerable": score -= 15
    if headers["X-Content-Type-Options"]["status"] == "Vulnerable": score -= 10

    # Spoofing Protections Deductions
    if dns_sec["SPF"]["status"] == "Missing": score -= 15
    if dns_sec["DMARC"]["status"] == "Missing": score -= 15

    # Critical deductions for dangerous open ports found via Shodan
    open_ports = shodan_intel.get("open_ports", [])
    if 21 in open_ports: score -= 10   # FTP exposed
    if 23 in open_ports: score -= 15   # Telnet exposed
    if 3306 in open_ports: score -= 20 # MySQL Database exposed to the wild
    if 27017 in open_ports: score -= 20 # MongoDB Database exposed to the wild

    # Deduct points for known unpatched exploits/CVEs
    vulns = shodan_intel.get("vulnerabilities", [])
    if vulns:
        score -= min(30, len(vulns) * 10) # Cap maximum vulnerability penalty to 30 points

    score = max(0, score)

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
    shodan_report = query_shodan_intelligence(target_domain)
    score_report = calculate_score(header_report, dns_report, shodan_report)
    
    final_scorecard = {
        "domain": target_domain,
        "rating": score_report,
        "security_headers": header_report,
        "dns_security": dns_report,
        "infrastructure": shodan_report
    }
    
    print(json.dumps(final_scorecard, indent=4))

if __name__ == "__main__":
    main()