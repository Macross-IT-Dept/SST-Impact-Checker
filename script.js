document.addEventListener('DOMContentLoaded', function() {
    const revenueInput = document.getElementById('revenueInput');
    const serviceCategorySelect = document.getElementById('serviceCategory');
    const subCategoryContainer = document.getElementById('subCategoryContainer'); // Still needed for reference
    const subServiceCategorySelect = document.getElementById('subServiceCategory');
    const calculateButton = document.getElementById('calculateSST');
    const resultDisplay = document.getElementById('resultDisplay');
    const sstStatus = document.getElementById('sstStatus');

    const categoryDetailsDiv = document.getElementById('categoryDetails');
    const selectedServiceNameSpan = document.getElementById('selectedServiceName');
    const categoryDescriptionSpan = document.getElementById('categoryDescription'); // This span will no longer be updated
    const categoryRateSpan = document.getElementById('categoryRate');
    const categoryThresholdSpan = document.getElementById('categoryThreshold');

    // NEW: References for the Student's Annual Fee input
    const studentFeeContainer = document.getElementById('studentFeeContainer');
    const studentFeeInput = document.getElementById('studentFeeInput');

    const sstCategoriesData = {
        "rental_leasing": {
            name: "Rental / Leasing Services (Non-Residential)",
            type: "parent",
            subCategories: {
                "rental_leasing_asset": {
                    name: "Leasing of tangible assets other than real estate (such as machinery and equipment)",
                    // description: "Leasing of tangible assets, excluding real estate.", // REMOVED
                    rate: 0.08, // 8%
                    threshold: 500000
                }
            }
        },
        "construction_engineering": {
            name: "Construction and Engineering Services (Non-Residential)",
            type: "parent",
            subCategories: {
                "construction_engineering_general": {
                    name: "Covers construction, expansion, renovation, installation, and related works (excluding residential development)",
                    // description: "Construction, expansion, renovation, installation, etc., non-residential.", // REMOVED
                    rate: 0.06, // 6%
                    threshold: 1500000
                }
            }
        },
        "financial_fees": {
            name: "Financial Services Fees",
            type: "parent",
            subCategories: {
                "financial_service_fees": {
                    name: "Service fees, handling charges, or commission",
                    // description: "Fees and commissions for general financial services.", // REMOVED
                    rate: 0.06,
                    threshold: 500000
                },
                "brokerage_underwriting": {
                    name: "Brokerage, underwriting, and money brokering services",
                    // description: "Brokerage and related financial intermediary services.", // REMOVED
                    rate: 0.06,
                    threshold: 500000
                },
                "financial_transactions_handling": {
                    name: "Handling fees or commissions for financial transactions",
                    // description: "Charges for processing financial transactions.", // REMOVED
                    rate: 0.06,
                    threshold: 500000
                },
                "insurance_takaful_premiums": {
                    name: "Insurance/Takaful Premiums",
                    // description: "Premiums for insurance and Takaful products.", // REMOVED
                    rate: 0.06,
                    threshold: 500000
                }
            }
        },
        "private_healthcare": {
            name: "Private Healthcare Services",
            type: "parent",
            subCategories: {
                "clinics": {
                    name: "Clinics",
                    // description: "General private clinic services.", // REMOVED
                    rate: 0.06,
                    threshold: 1500000
                },
                "private_hospitals": {
                    name: "Private Hospitals",
                    // description: "Services provided by private hospitals.", // REMOVED
                    rate: 0.06,
                    threshold: 1500000
                },
                "health_centres": {
                    name: "Health Centres",
                    // description: "Services from health centers.", // REMOVED
                    rate: 0.06,
                    threshold: 1500000
                },
                "aesthetic_medical": {
                    name: "Aesthetic Medical Centres",
                    // description: "Aesthetic and cosmetic medical services.", // REMOVED
                    rate: 0.06,
                    threshold: 1500000
                },
                "tcm_allied_health": {
                    name: "Traditional & Complementary Medicine (TCM) and Allied Health",
                    // description: "TCM and allied health services.", // REMOVED
                    rate: 0.06,
                    threshold: 1500000
                }
            }
        },
        "beauty_wellness": {
            name: "Beauty & Wellness Centre Services",
            type: "parent",
            subCategories: {
                "hair_salons": {
                    name: "Hair Salons (Haircutting, Washing, Styling, Colouring, Perming)",
                    // description: "Hair-related services.", // REMOVED
                    rate: 0.06,
                    threshold: 500000
                },
                "massage_centres": {
                    name: "Massage Centres (Body Massage, Reflexology, Aromatherapy, Cupping)",
                    // description: "Various massage and relaxation therapies.", // REMOVED
                    rate: 0.06,
                    threshold: 500000
                },
                "postnatal_elderly_care": {
                    name: "Postnatal And Elderly Care Services (Confinement Care, Traditional Therapy, Elderly Wellness Programs)",
                    // description: "Care services for postnatal and elderly individuals.", // REMOVED
                    rate: 0.06,
                    threshold: 500000
                },
                "tattoo": {
                    name: "Tattoo (Body Tattooing, Permanent Makeup)",
                    // description: "Body art and permanent makeup services.", // REMOVED
                    rate: 0.06,
                    threshold: 500000
                },
                "makeup_bridal": {
                    name: "Make Up / Bridal Make-Up",
                    // description: "Makeup services for various occasions.", // REMOVED
                    rate: 0.06,
                    threshold: 500000
                },
                "slimming": {
                    name: "Slimming Treatments",
                    // description: "Treatments focused on weight reduction.", // REMOVED
                    rate: 0.06,
                    threshold: 500000
                },
                "nail_services": {
                    name: "Nail Services (Manicure, Pedicure, Nail Art, Gel/Acrylic Application)",
                    // description: "Manicure, pedicure, and nail art services.", // REMOVED
                    rate: 0.06,
                    threshold: 500000
                },
                "facial_treatments": {
                    name: "Facial Treatments (Skincare Procedures, Exfoliation, Acne Control, Non-Medical Facial Therapy)",
                    // description: "Various facial skincare treatments.", // REMOVED
                    rate: 0.06,
                    threshold: 500000
                },
                "body_care": {
                    name: "Body Care (Body Wraps, Scrubs, Aroma Oil Therapy, Spa)",
                    // description: "Body treatments and spa services.", // REMOVED
                    rate: 0.06,
                    threshold: 500000
                }
            }
        },
        "private_education": {
            name: "Private Education Services (Selected)",
            type: "parent",
            subCategories: {
                "non_citizens_education": {
                    name: "Private Educational Institutions (non-citizens)",
                    // description: "Educational services provided to non-citizen students. SST applies if a student's annual fee exceeds RM60,000.", // REMOVED
                    rate: 0.06,
                    threshold: 500000
                }
            }
        }
    };

    // --- Helper Functions ---
    function updateCategoryDetails(data) {
        selectedServiceNameSpan.textContent = data.name;
        // REMOVED: categoryDescriptionSpan.textContent = data.description;
        categoryRateSpan.textContent = `${(data.rate * 100).toFixed(0)}%`;

        // Special threshold text for private education
        if (serviceCategorySelect.value === "private_education") {
            categoryThresholdSpan.textContent = "Over RM 60,000 of fees per student/year";
        } else {
            categoryThresholdSpan.textContent = `RM ${data.threshold.toLocaleString()}`;
        }
        categoryDetailsDiv.style.display = 'block';
    }

    function hideDetailsAndResults() {
        categoryDetailsDiv.style.display = 'none';
        resultDisplay.style.display = 'none'; // Clear results
        sstStatus.textContent = '';

        studentFeeContainer.style.display = 'none'; // Ensure student fee input is hidden
        studentFeeInput.value = ''; // Clear student fee input value
    }

    // --- Initial Setup on Page Load ---
    // Populate the main category dropdown
    for (const key in sstCategoriesData) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = sstCategoriesData[key].name;
        serviceCategorySelect.appendChild(option);
    }
    // Initially disable the sub-category dropdown
    subServiceCategorySelect.disabled = true;

    // --- Event Listener for Main Category Change ---
    serviceCategorySelect.addEventListener('change', function() {
        const selectedMainCategoryKey = this.value;
        const selectedMainCategoryData = sstCategoriesData[selectedMainCategoryKey];

        hideDetailsAndResults(); // Reset all details and sub-dropdown visibility

        // Clear previous sub-category options and add default
        subServiceCategorySelect.innerHTML = '<option value="">-- Select a sub-category --</option>';

        if (selectedMainCategoryKey) {
            // Enable sub-category dropdown and populate it
            subServiceCategorySelect.disabled = false;
            for (const subKey in selectedMainCategoryData.subCategories) {
                const subOption = document.createElement('option');
                subOption.value = subKey;
                subOption.textContent = selectedMainCategoryData.subCategories[subKey].name;
                subServiceCategorySelect.appendChild(subOption);
            }

            // Logic for Private Education: Disable Revenue and Show Student Fee
            if (selectedMainCategoryKey === "private_education") {
                revenueInput.disabled = true; // Disable main revenue input
                revenueInput.value = ''; // Clear its value
                studentFeeContainer.style.display = 'block'; // Show student fee input
            } else {
                revenueInput.disabled = false; // Enable main revenue input for other categories
                studentFeeContainer.style.display = 'none'; // Hide student fee input
                studentFeeInput.value = ''; // Clear its value
            }

        } else { // If "Select a category" is chosen
            subServiceCategorySelect.disabled = true;
            revenueInput.disabled = false; // Ensure revenue input is enabled
            hideDetailsAndResults(); // Hide all related fields and results
        }
    });

    // --- Event Listener for Sub-Category Change ---
    subServiceCategorySelect.addEventListener('change', function() {
        const selectedMainCategoryKey = serviceCategorySelect.value;
        const selectedSubCategoryKey = this.value;

        // Clear previous results
        resultDisplay.style.display = 'none';
        sstStatus.textContent = '';

        if (selectedMainCategoryKey && selectedSubCategoryKey) {
            const mainData = sstCategoriesData[selectedMainCategoryKey];
            const subData = mainData.subCategories[selectedSubCategoryKey];
            updateCategoryDetails(subData); // Update with sub-category specific data
        } else {
            categoryDetailsDiv.style.display = 'none'; // Hide if no sub-category selected
        }
    });

    // --- Calculate SST Button Click Listener ---
    calculateButton.addEventListener('click', function() {
        const selectedMainCategoryKey = serviceCategorySelect.value;
        const selectedSubCategoryKey = subServiceCategorySelect.value;

        let selectedServiceData = null;

        if (selectedMainCategoryKey && selectedSubCategoryKey) {
            const mainData = sstCategoriesData[selectedMainCategoryKey];
            selectedServiceData = mainData.subCategories[selectedSubCategoryKey];
        }

        // Validate category selection first
        if (!selectedMainCategoryKey || !selectedSubCategoryKey || !selectedServiceData) {
            sstStatus.textContent = "Please select both a main category and a sub-category.";
            sstStatus.className = 'text-center text-danger';
            resultDisplay.style.display = 'block';
            return;
        }

        let willBeHitBySST = false;
        let estimatedSST = 0;
        const currentRate = selectedServiceData.rate;

        // Logic for Private Education
        if (selectedMainCategoryKey === "private_education") {
            const studentAnnualFee = parseFloat(studentFeeInput.value);

            if (isNaN(studentAnnualFee) || studentAnnualFee < 0) {
                sstStatus.textContent = "Please enter a valid student's annual fee.";
                sstStatus.className = 'text-center text-danger';
                resultDisplay.style.display = 'block';
                return;
            }

            // SST applies if student annual fee is greater than RM60,000
            if (studentAnnualFee > 60000) {
                willBeHitBySST = true;
                estimatedSST = studentAnnualFee * currentRate; // Calculate based on student fee
            } else {
                // Specific message for private education if not hit
                sstStatus.textContent = "NO, you are likely NOT hit by SST (Student's annual fee not over RM60,000).";
                sstStatus.className = 'text-center text-primary';
                resultDisplay.style.display = 'block';
                return; // Exit as result is displayed
            }

        } else {
            // Logic for all other categories (using main revenue input)
            const annualRevenue = parseFloat(revenueInput.value);
            const currentThreshold = selectedServiceData.threshold;

            if (isNaN(annualRevenue) || annualRevenue < 0) {
                sstStatus.textContent = "Please enter a valid annual revenue.";
                sstStatus.className = 'text-center text-danger';
                resultDisplay.style.display = 'block';
                return;
            }

            if (annualRevenue >= currentThreshold) {
                willBeHitBySST = true;
                estimatedSST = annualRevenue * currentRate;
            }
        }

        // Display results for all categories
        resultDisplay.style.display = 'block';
        if (willBeHitBySST) {
            sstStatus.textContent = `YES, you will likely be hit by SST.`;
            sstStatus.className = 'text-center text-success';
        } else {
            // General "NO" message for categories other than private education
            if (selectedMainCategoryKey !== "private_education") {
                sstStatus.textContent = `NO, you are likely NOT hit by SST.`;
            }
            // The "NO" message for private education is already set in its specific block above.
            sstStatus.className = 'text-center text-primary';
        }
    });
});
