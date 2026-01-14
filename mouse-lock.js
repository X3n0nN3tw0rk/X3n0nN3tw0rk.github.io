(function() {
  let locked = false;
  let pointerReady = false;

  // Create lock button dynamically
  const lockBtn = document.createElement("button");
  lockBtn.id = "lockBtn";
  lockBtn.innerHTML = "🖱️";
  Object.assign(lockBtn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "#333",
    color: "white",
    fontSize: "24px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "9999",
    transition: "background 0.2s"
  });

  // Hover effect
  lockBtn.addEventListener("mouseover", () => {
    if (!locked) lockBtn.style.background = "#555";
  });
  lockBtn.addEventListener("mouseout", () => {
    if (!locked) lockBtn.style.background = locked ? "#0f0" : "#333";
  });

  // Append to body
  document.body.appendChild(lockBtn);

  // First tap/click or touch enables pointer lock gestures (required on iPad)
  const enablePointer = () => {
    pointerReady = true;
    console.log("Pointer lock ready! Press B or click the button to lock/unlock.");
    document.body.removeEventListener("click", enablePointer);
    document.body.removeEventListener("touchstart", enablePointer);
  };
  document.body.addEventListener("click", enablePointer);
  document.body.addEventListener("touchstart", enablePointer);

  // Toggle lock when clicking the button
  lockBtn.addEventListener("click", () => {
    if (!pointerReady) return;
    togglePointerLock();
  });

  // Toggle lock with B key (desktop & external keyboards)
  document.addEventListener("keydown", (e) => {
    if (!pointerReady) return;
    if (e.key.toLowerCase() === "b") {
      e.preventDefault();
      togglePointerLock();
    }
  });

  function togglePointerLock() {
    if (!document.pointerLockElement) {
      document.body.requestPointerLock();
    } else {
      document.exitPointerLock();
    }
  }

  // Pointer lock change event
  document.addEventListener("pointerlockchange", () => {
    locked = !!document.pointerLockElement;
    lockBtn.style.background = locked ? "#0f0" : "#333"; // green if locked
    console.log(locked ? "Mouse locked ✅" : "Mouse unlocked ❌");
  });

  // Track mouse movement
  document.addEventListener("mousemove", (e) => {
    if (locked) {
      console.log("Mouse moved:", "X:", e.movementX, "Y:", e.movementY);
    }
  });
})();
