# Convert.com Implementation Guide

## Quick Setup Instructions

### 1. Create New Experiment in Convert.com

1. **Login to Convert.com** and navigate to your project dashboard
2. **Click "Create Experiment"** and select "Split URL Test" or "A/B Test"
3. **Enter experiment details:**
   - **Name:** Green Navigation Bar Test
   - **Hypothesis:** Green navigation will improve brand perception and conversions
   - **Primary Goal:** Conversion Rate

### 2. Configure Targeting

#### URL Targeting
```
Site Area: Entire Site
URL Pattern: .* (matches all pages)
```

#### Audience Targeting
```
Device: All Devices
Browser: All Browsers
Traffic Allocation: 50% Control / 50% Treatment
```

### 3. Add Variant Code

#### In Convert.com Editor:

1. **Create Variant:** Click "Add Variant" → "Code Editor"
2. **Add CSS Code:** Copy and paste the entire content of `variant.css`
3. **Add JavaScript Code:** Copy and paste the entire content of `variant.js`

#### Alternative: Direct File Upload
1. Upload `variant.css` to your CDN or hosting
2. Upload `variant.js` to your CDN or hosting
3. In Convert.com, add these lines to the variant:

```html
<link rel="stylesheet" href="https://your-domain.com/path/to/variant.css">
<script src="https://your-domain.com/path/to/variant.js"></script>
```

### 4. Configure Goals

#### Primary Goal
```
Goal Type: Revenue/Conversion Goal
Goal Name: Primary Conversion
Tracking: Your existing conversion tracking
```

#### Secondary Goals
```
1. Page Views per Session
2. Time on Site  
3. Bounce Rate
4. Navigation Clicks (custom event)
```

### 5. Quality Assurance

#### Pre-Launch Checklist
- [ ] Preview the variant in Convert.com's visual editor
- [ ] Test on desktop (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Verify navigation functionality remains intact
- [ ] Confirm text readability on green background
- [ ] Check analytics tracking is firing

#### Browser Testing URLs
Use Convert.com's preview URLs to test across devices:
```
Control: https://your-site.com?convert_preview=control
Treatment: https://your-site.com?convert_preview=variant_1
```

### 6. Launch Configuration

#### Traffic Allocation
```
Control: 50%
Treatment: 50%
Total Traffic: 100% (or adjust based on your needs)
```

#### Duration Settings
```
Minimum Duration: 7 days
Maximum Duration: 21 days
Confidence Level: 95%
```

### 7. Analytics Integration

#### Google Analytics
The JavaScript automatically tracks events to Google Analytics if available:
```javascript
// Events tracked:
- green_nav_init (experiment started)
- green_nav_applied (styling applied successfully)
- green_nav_error (if any errors occur)
```

#### Convert.com Events
All events are automatically sent to Convert.com's analytics:
```javascript
// Convert.com tracking includes:
- Experiment participation
- Variant assignment
- Custom events with metadata
```

### 8. Monitoring & Optimization

#### Daily Checks (First 3 Days)
- Monitor JavaScript console for errors
- Check Convert.com's real-time stats
- Verify even traffic distribution
- Monitor conversion rate trends

#### Weekly Reviews
- Statistical significance progress
- Performance across device types
- Any user feedback or support tickets
- A/A test validation (if applicable)

### 9. Results Analysis

#### Success Metrics
- **Primary:** Conversion rate improvement ≥ 5%
- **Statistical Significance:** ≥ 95%
- **Sample Size:** ≥ 1000 visitors per variant

#### Analysis Tools
- Convert.com's built-in statistical analysis
- Segment analysis by device, traffic source, etc.
- Bayesian analysis for continuous monitoring
- User session recordings (if available)

### 10. Rollout Plan

#### If Test Wins (Green Navigation Performs Better):
1. Take screenshots of the winning variant
2. Export Convert.com results and statistical analysis
3. Implement permanent change in your site's CSS
4. Document learnings in the repository
5. Plan follow-up tests (different shades of green, etc.)

#### If Test Loses or is Inconclusive:
1. Document the learnings
2. Archive the experiment code
3. Plan alternative navigation improvements
4. Consider testing other navigation elements

## Troubleshooting Common Issues

### Issue: Green styling not appearing
**Solution:** Check CSS specificity and ensure `!important` declarations are working

### Issue: JavaScript errors in console
**Solution:** Verify DOM selectors are correct for your specific navigation structure

### Issue: Mobile navigation broken
**Solution:** Test the responsive CSS selectors and mobile-specific navigation elements

### Issue: Analytics not tracking
**Solution:** Verify Google Analytics and Convert.com integration is properly configured

## File Checklist

Ensure these files are ready for deployment:
- [ ] `spec.yaml` - Experiment specification
- [ ] `README.md` - Experiment overview
- [ ] `plan.md` - Implementation plan
- [ ] `variant.css` - CSS modifications
- [ ] `variant.js` - JavaScript implementation
- [ ] `demo.html` - Testing demo page
- [ ] This implementation guide

## Contact & Support

For technical issues with this A/B test implementation:
1. Check the repository documentation
2. Review Convert.com's support documentation
3. Test using the provided demo.html file
4. Monitor browser console for JavaScript errors

---

**Implementation Time:** ~30 minutes  
**Testing Time:** ~1 hour  
**Expected Results:** Available in 7-14 days  
**Statistical Power:** 95% confidence level