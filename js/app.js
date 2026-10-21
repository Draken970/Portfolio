/**
 * Sarvesh Wadkar — 3D Developer Portfolio Logic
 * Three.js 3D Interactive Canvases, Alternating Timeline, 3D Tilt Cards & System Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  init3DStarfield();
  initHero3DCanvas();
  initContactEarth3D();
  init3DTiltCards();
  initArchitectureExplorer();
  initProjectFiltering();
  initTerminal();
  initContactForm();
  initCopyButtons();
  initResumeModal();
  initSmoothScroll();
  initMetricsCounter();
  initCaseStudyModal();
  initWebAudioSFX();
});

/* --------------------------------------------------------------------------
   1. Navbar Scroll State & Spy
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   2. Mobile Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.style.display === 'flex';
    if (isOpen) {
      navLinks.style.display = 'none';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = 'var(--header-height)';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
      navLinks.style.padding = '1.75rem';
      navLinks.style.borderBottom = '1px solid rgba(145, 94, 255, 0.25)';
      navLinks.style.gap = '1.5rem';
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Fullscreen 3D Starfield Canvas (Signature 3D Portfolio Background)
   -------------------------------------------------------------------------- */
function init3DStarfield() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const stars = [];
  const numStars = 650;
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - width / 2) * 0.0004;
    mouseY = (e.clientY - height / 2) * 0.0004;
  });

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 1500 + 50,
      radius: Math.random() * 1.4 + 0.6,
      color: Math.random() > 0.4 ? 'rgba(255, 255, 255, ' : 'rgba(145, 94, 255, '
    });
  }

  function renderStars() {
    ctx.clearRect(0, 0, width, height);

    const fov = 400;
    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];

      // Subtle rotation and mouse parallax
      const cosX = Math.cos(mouseX);
      const sinX = Math.sin(mouseX);
      const cosY = Math.cos(mouseY);
      const sinY = Math.sin(mouseY);

      // Rotate around Y
      let x = star.x * cosX - star.z * sinX;
      let z = star.z * cosX + star.x * sinX;

      // Rotate around X
      let y = star.y * cosY - z * sinY;
      z = z * cosY + star.y * sinY;

      // Drift forward
      star.z -= 0.6;
      if (star.z <= 10) {
        star.z = 1500;
      }

      const scale = fov / (fov + z);
      const px = cx + x * scale;
      const py = cy + y * scale;

      if (px >= 0 && px <= width && py >= 0 && py <= height && z > -fov) {
        const alpha = Math.min(1, Math.max(0.1, (1 - z / 1500) * 0.95));
        ctx.beginPath();
        ctx.arc(px, py, star.radius * scale * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = star.color + alpha + ')';
        ctx.fill();
      }
    }

    requestAnimationFrame(renderStars);
  }

  renderStars();
}

/* --------------------------------------------------------------------------
   4. Hero 3D Interactive Cyber Core / Floating Tech Hologram
   -------------------------------------------------------------------------- */
function initHero3DCanvas() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  // 3D Icosahedron Vertices
  const phi = (1 + Math.sqrt(5)) / 2;
  const rawVertices = [
    [-1,  phi,  0], [ 1,  phi,  0], [-1, -phi,  0], [ 1, -phi,  0],
    [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
    [ phi,  0, -1], [ phi,  0,  1], [-phi,  0, -1], [-phi,  0,  1]
  ];

  // Edges connecting vertices
  const edges = [];
  const radius = 105;
  const vertices = rawVertices.map(v => {
    const len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    return [(v[0]/len)*radius, (v[1]/len)*radius, (v[2]/len)*radius];
  });

  // Calculate edges between closest pairs
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const d = Math.hypot(
        vertices[i][0] - vertices[j][0],
        vertices[i][1] - vertices[j][1],
        vertices[i][2] - vertices[j][2]
      );
      if (d < radius * 1.15) {
        edges.push([i, j]);
      }
    }
  }

  // Floating particles inside and around core
  const coreParticles = [];
  for (let i = 0; i < 40; i++) {
    coreParticles.push({
      theta: Math.random() * Math.PI * 2,
      phi: Math.acos(Math.random() * 2 - 1),
      r: radius * (0.4 + Math.random() * 0.9),
      speed: (Math.random() - 0.5) * 0.02
    });
  }

  let rotX = 0.2;
  let rotY = 0.4;
  let targetRotX = 0.2;
  let targetRotY = 0.4;

  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => (isDragging = false));

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      targetRotY += dx * 0.01;
      targetRotX += dy * 0.01;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    } else {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (dist < 400) {
        targetRotY += (e.clientX - cx) * 0.00003;
        targetRotX += (e.clientY - cy) * 0.00003;
      }
    }
  });

  function renderHero3D() {
    ctx.clearRect(0, 0, width, height);

    targetRotY += 0.006;
    rotX += (targetRotX - rotX) * 0.08;
    rotY += (targetRotY - rotY) * 0.08;

    const cx = width / 2;
    const cy = height / 2;
    const fov = 340;

    // Projected vertices
    const projected = vertices.map(([x, y, z]) => {
      // Rotate Y
      let x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
      let z1 = z * Math.cos(rotY) + x * Math.sin(rotY);

      // Rotate X
      let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
      let z2 = z1 * Math.cos(rotX) + y * Math.sin(rotX);

      const scale = fov / (fov + z2 + 100);
      return {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        z: z2,
        scale
      };
    });

    // Outer Orbital Ring 1
    ctx.beginPath();
    for (let a = 0; a <= Math.PI * 2; a += 0.1) {
      const ox = Math.cos(a) * (radius * 1.5);
      const oz = Math.sin(a) * (radius * 1.5);
      const oy = 0;

      let x1 = ox * Math.cos(rotY * 0.8) - oz * Math.sin(rotY * 0.8);
      let z1 = oz * Math.cos(rotY * 0.8) + ox * Math.sin(rotY * 0.8);
      let y2 = oy * Math.cos(rotX * 0.8 + 0.4) - z1 * Math.sin(rotX * 0.8 + 0.4);
      let z2 = z1 * Math.cos(rotX * 0.8 + 0.4) + oy * Math.sin(rotX * 0.8 + 0.4);

      const scale = fov / (fov + z2 + 100);
      const px = cx + x1 * scale;
      const py = cy + y2 * scale;

      if (a === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = 'rgba(145, 94, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Outer Orbital Ring 2 (Crisp Silver-White)
    ctx.beginPath();
    for (let a = 0; a <= Math.PI * 2; a += 0.1) {
      const ox = Math.cos(a) * (radius * 1.35);
      const oy = Math.sin(a) * (radius * 1.35);
      const oz = 0;

      let x1 = ox * Math.cos(-rotY * 0.6) - oz * Math.sin(-rotY * 0.6);
      let z1 = oz * Math.cos(-rotY * 0.6) + ox * Math.sin(-rotY * 0.6);
      let y2 = oy * Math.cos(-rotX * 0.6 - 0.5) - z1 * Math.sin(-rotX * 0.6 - 0.5);
      let z2 = z1 * Math.cos(-rotX * 0.6 - 0.5) + oy * Math.sin(-rotX * 0.6 - 0.5);

      const scale = fov / (fov + z2 + 100);
      const px = cx + x1 * scale;
      const py = cy + y2 * scale;

      if (a === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Draw Edges with glowing gradient
    edges.forEach(([i, j]) => {
      const p1 = projected[i];
      const p2 = projected[j];
      const avgZ = (p1.z + p2.z) / 2;
      const alpha = Math.max(0.15, Math.min(0.9, (avgZ + radius) / (radius * 2) * 0.8 + 0.2));

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = `rgba(145, 94, 255, ${alpha})`;
      ctx.lineWidth = 1.8 * Math.max(p1.scale, p2.scale);
      ctx.stroke();
    });

    // Draw Vertices Nodes
    projected.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4 * p.scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Central core glow
    const coreGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, radius * 0.75);
    coreGrad.addColorStop(0, 'rgba(145, 94, 255, 0.55)');
    coreGrad.addColorStop(0.5, 'rgba(145, 94, 255, 0.25)');
    coreGrad.addColorStop(1, 'rgba(145, 94, 255, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.8, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(renderHero3D);
  }

  renderHero3D();
}

/* --------------------------------------------------------------------------
   5. Contact Section 3D Rotating Earth Globe
   -------------------------------------------------------------------------- */
function initContactEarth3D() {
  const canvas = document.getElementById('contact-earth-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  const globeRadius = Math.min(width, height) * 0.38;
  let rotY = 0;
  let rotX = 0.25;

  function renderEarth() {
    ctx.clearRect(0, 0, width, height);
    rotY += 0.007;

    const cx = width / 2;
    const cy = height / 2;

    // Atmosphere halo glow
    const halo = ctx.createRadialGradient(cx, cy, globeRadius * 0.8, cx, cy, globeRadius * 1.25);
    halo.addColorStop(0, 'rgba(145, 94, 255, 0.35)');
    halo.addColorStop(0.5, 'rgba(145, 94, 255, 0.15)');
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, globeRadius * 1.25, 0, Math.PI * 2);
    ctx.fill();

    // Dark Earth Core — Pure Stealth Black
    const earthBase = ctx.createRadialGradient(cx - globeRadius * 0.3, cy - globeRadius * 0.3, 10, cx, cy, globeRadius);
    earthBase.addColorStop(0, '#1c1c1c');
    earthBase.addColorStop(0.7, '#0b0b0b');
    earthBase.addColorStop(1, '#000000');
    ctx.fillStyle = earthBase;
    ctx.beginPath();
    ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Longitude Lines
    for (let lng = 0; lng < Math.PI; lng += Math.PI / 8) {
      ctx.beginPath();
      for (let lat = -Math.PI / 2; lat <= Math.PI / 2; lat += 0.1) {
        const x = globeRadius * Math.cos(lat) * Math.sin(lng + rotY);
        const z = globeRadius * Math.cos(lat) * Math.cos(lng + rotY);
        const y = globeRadius * Math.sin(lat);

        if (z > 0) {
          const px = cx + x;
          const py = cy + y * Math.cos(rotX) - z * Math.sin(rotX) * 0.3;
          if (lat === -Math.PI / 2) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      }
      ctx.strokeStyle = 'rgba(145, 94, 255, 0.22)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw Latitude Lines
    for (let lat = -Math.PI / 3; lat <= Math.PI / 3; lat += Math.PI / 6) {
      ctx.beginPath();
      for (let lng = 0; lng <= Math.PI * 2; lng += 0.1) {
        const x = globeRadius * Math.cos(lat) * Math.sin(lng + rotY);
        const z = globeRadius * Math.cos(lat) * Math.cos(lng + rotY);
        const y = globeRadius * Math.sin(lat);

        if (z > 0) {
          const px = cx + x;
          const py = cy + y * Math.cos(rotX) - z * Math.sin(rotX) * 0.3;
          if (lng === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Outer Rim Glow
    ctx.beginPath();
    ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(145, 94, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#915eff';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;

    requestAnimationFrame(renderEarth);
  }

  renderEarth();
}

/* --------------------------------------------------------------------------
   6. Interactive 3D Tilt Cards (Mouse Parallax Tilt on Hover)
   -------------------------------------------------------------------------- */
function init3DTiltCards() {
  const cards = document.querySelectorAll('.overview-card-wrapper, .project-3d-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
  });
}

/* --------------------------------------------------------------------------
   7. Interactive System Architecture Explorer
   -------------------------------------------------------------------------- */
const architectureData = {
  cinebook: {
    nodes: {
      client: {
        title: 'Client Request & WebSocket',
        badge: 'Incoming Traffic',
        desc: 'Concurrent seat selection triggers a dual pathway: HTTP POST for immediate reservation attempt and persistent WebSocket connection via Socket.io for seat lock events.',
        code: `// Client WebSocket seat listener\nsocket.on("seat:locked", ({ seatId, userId, ttl }) => {\n  renderSeatState(seatId, "LOCKED", ttl);\n});`
      },
      gateway: {
        title: 'Node.js / Express API Gateway',
        badge: 'Rate Limiter & Validation',
        desc: 'Sanitizes input parameters (seatId, venueId, userJwt). Implements token bucket rate limiting to prevent spam attacks during high-demand movie drops.',
        code: `// Express Route Handler\nrouter.post("/api/v1/seats/:id/reserve", authMiddleware, async (req, res) => {\n  const { seatId } = req.params;\n  const lockAcquired = await redisLockService.acquire(seatId, req.user.id);\n  ...\n});`
      },
      redis: {
        title: 'Redis SET NX Atomic Lock Engine',
        badge: 'Distributed Concurrency',
        desc: 'Uses Redis SET NX PX (set if not exists with millisecond TTL). Guarantees strict linearizability across 100+ simultaneous requests for the exact same seat, eliminating double booking.',
        code: `// Atomic lock with 600-second TTL\nconst result = await redis.set(\n  \`lock:seat:\${seatId}\`,\n  userId,\n  "NX",\n  "EX",\n  600\n);\nif (!result) throw new SeatAlreadyReservedError();`
      },
      postgres: {
        title: 'PostgreSQL Relational Storage',
        badge: 'ACID Transaction DB',
        desc: 'Once payment webhook succeeds, commits permanent ticket row inside an ACID transaction with foreign key constraints. Relieves database from handling seat lock contention.',
        code: `BEGIN;\nUPDATE seats SET status = 'SOLD', booked_by = $1 WHERE id = $2;\nINSERT INTO bookings (seat_id, user_id, amount) VALUES ($2, $1, $3);\nCOMMIT;`
      },
      websocket: {
        title: 'Socket.io Cluster Broadcaster',
        badge: 'Real-Time Sync (<100ms)',
        desc: 'Broadcasting engine publishes state change across client nodes. Syncs state to under 100ms latency, updating user screens in real time without polling.',
        code: `// Real-time broadcast to room\nio.to(\`auditorium:\${venueId}\`).emit("seat:state_change", {\n  seatId,\n  status: "LOCKED",\n  expiresIn: 600\n});`
      }
    }
  },
  cctv: {
    nodes: {
      rtsp: {
        title: 'Building NVR (15+ Cameras)',
        badge: 'Video Ingestion',
        desc: 'Building Network Video Recorder feeds multiple H.264/H.265 RTSP streams. To prevent bandwidth saturation, inference worker requests the secondary low-resolution sub-stream (480p) instead of 4K main streams.',
        code: `// RTSP Sub-stream URI configuration\nrtsp://admin:pass@192.168.1.120:554/Streaming/Channels/102\n// Channels/102 is the low-bitrate sub-stream for computer vision`
      },
      fastapi: {
        title: 'Python / FastAPI Inference Worker',
        badge: 'Async Pipeline',
        desc: 'Runs on an on-premise edge machine adjacent to the NVR. Captures frames asynchronously using OpenCV with frame-skipping logic to maintain real-time frame rates under high camera load.',
        code: `@app.on_event("startup")\nasync def spawn_camera_workers():\n  for cam_id, stream_url in CAMERAS.items():\n    asyncio.create_task(run_rtsp_tracker(cam_id, stream_url))`
      },
      yolo: {
        title: 'YOLOv8 Edge Detection',
        badge: 'Object Detection',
        desc: 'Customized YOLOv8 nano/small model fine-tuned for human detection. Processes sub-stream frames with high accuracy and minimal GPU/CPU overhead on local hardware.',
        code: `results = yolo_model.predict(\n  source=frame,\n  classes=[0], // Class 0 = Person\n  conf=0.45,\n  imgsz=640,\n  verbose=False\n)`
      },
      bytetrack: {
        title: 'ByteTrack Multi-Object Tracker',
        badge: 'Trajectory Association',
        desc: 'Maintains consistent IDs across frames even during brief occlusions or people crossing paths, enabling accurate headcount and dwell-time metrics.',
        code: `online_targets = tracker.update(\n  output_results=detections,\n  img_info=frame.shape,\n  img_size=frame.shape\n)`
      },
      netbird: {
        title: 'NetBird Private Mesh VPN Tunnel',
        badge: 'Zero-Trust Secure Access',
        desc: 'Eliminates open ports and port-forwarding on the building router. Creates an encrypted WireGuard peer-to-peer overlay tunnel connecting the edge machine directly to central monitoring.',
        code: `# NetBird WireGuard secure peer overlay\nnetbird up --setup-key \${NETBIRD_SETUP_KEY}\n# Connects private 100.x.x.x mesh network without exposed ports`
      }
    }
  },
  aahar: {
    nodes: {
      nextjs: {
        title: 'Next.js 15 Client & App Router',
        badge: 'React Server Components',
        desc: 'Server-rendered pages for ultra-fast initial loads paired with interactive React client components for dynamic order tables, real-time inventory adjustments, and responsive dashboard charts.',
        code: `// app/inventory/page.tsx\nexport default async function InventoryPage() {\n  const session = await getServerSession(authOptions);\n  const stockData = await getInventoryStock(session.orgId);\n  return <InventoryClientView initialData={stockData} />;\n}`
      },
      rbac: {
        title: 'RBAC Permission Middleware',
        badge: 'Security & Access Control',
        desc: 'Granular role-based middleware guarding inventory adjustments, supplier pricing, and invoice approvals across Owner, Admin, Manager, and Warehouse Operator roles.',
        code: `export async function middleware(req: NextRequest) {\n  const token = await getToken({ req });\n  const hasAccess = checkPermission(token?.role, req.nextUrl.pathname);\n  if (!hasAccess) return NextResponse.redirect(new URL("/unauthorized", req.url));\n}`
      },
      inventory: {
        title: 'Automated Inventory & Ledger Engine',
        badge: 'State Machine & Auditing',
        desc: 'Handles material intake, dispatch deductions, and automated reorder alerts with atomic document updates in MongoDB to prevent negative inventory balances.',
        code: `await InventoryModel.updateOne(\n  { sku: itemSku, currentStock: { $gte: quantity } },\n  { $inc: { currentStock: -quantity }, $push: { logs: auditEntry } }\n);`
      },
      invoicing: {
        title: 'Invoicing & Automated Payment Flows',
        badge: 'Financial Pipeline',
        desc: 'Generates GST-compliant invoices, coordinates multi-stage approval, and triggers webhook payment reconciliation with PDF export.',
        code: `const invoice = await generateInvoicePDF({\n  orderId,\n  taxBreakup: calculateGst(items),\n  clientBillingDetails\n});\nawait sendInvoiceEmail(invoice.url);`
      },
      mongodb: {
        title: 'MongoDB Production Cluster',
        badge: 'Document Store & Indexing',
        desc: 'Optimized schema with compound indexes on { organizationId, createdAt } and { sku, warehouseId } for sub-millisecond query response on thousands of SKU records.',
        code: `InventorySchema.index({ organizationId: 1, sku: 1 }, { unique: true });\nInvoiceSchema.index({ status: 1, dueDate: 1 });`
      }
    }
  }
};

function initArchitectureExplorer() {
  const tabBtns = document.querySelectorAll('.arch-tab-btn');
  const tabPanels = document.querySelectorAll('.arch-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetArch = btn.getAttribute('data-arch');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(`arch-${targetArch}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  document.querySelectorAll('.arch-node').forEach(node => {
    node.addEventListener('click', () => {
      const archKey = node.getAttribute('data-arch-key');
      const nodeKey = node.getAttribute('data-node-key');

      const parentPipeline = node.closest('.arch-tab-content');
      parentPipeline.querySelectorAll('.arch-node').forEach(n => n.classList.remove('selected'));
      node.classList.add('selected');

      const data = architectureData[archKey]?.nodes[nodeKey];
      if (data) {
        const inspector = parentPipeline.querySelector('.arch-inspector-box');
        if (inspector) {
          inspector.querySelector('.inspector-node-title').textContent = data.title;
          inspector.querySelector('.inspector-tag').textContent = data.badge;
          inspector.querySelector('.inspector-desc').textContent = data.desc;
          inspector.querySelector('.inspector-code').textContent = data.code;
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. Project Filtering Logic
   -------------------------------------------------------------------------- */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-3d-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   9. Developer Terminal Emulator
   -------------------------------------------------------------------------- */
function initTerminal() {
  const overlay = document.querySelector('.terminal-modal-overlay');
  const toggleBtns = document.querySelectorAll('.btn-terminal-toggle');
  const closeBtns = document.querySelectorAll('.terminal-close-btn');
  const terminalInput = document.getElementById('terminal-cli-input');
  const terminalOutput = document.getElementById('terminal-cli-output');
  const quickChips = document.querySelectorAll('.term-chip');

  if (!overlay || !terminalInput || !terminalOutput) return;

  const commandHistory = [];
  let historyIndex = -1;

  function openTerminal() {
    overlay.classList.add('open');
    terminalInput.focus();
  }

  function closeTerminal() {
    overlay.classList.remove('open');
  }

  toggleBtns.forEach(btn => btn.addEventListener('click', openTerminal));
  closeBtns.forEach(btn => btn.addEventListener('click', closeTerminal));

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeTerminal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeTerminal();
    }
  });

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) executeCommand(cmd);
    });
  });

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.value.trim();
      if (cmd) {
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;
        executeCommand(cmd);
        terminalInput.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  function executeCommand(rawCmd) {
    const cmd = rawCmd.toLowerCase().trim();
    printLine(`<span style="color:#915eff">sarvesh@sfit-mumbai:~$</span> ${escapeHtml(rawCmd)}`);

    switch (cmd) {
      case 'help':
        printLine(`
Available commands:
  <span style="color:#915eff">about</span>         - Engineering bio and background
  <span style="color:#915eff">skills</span>        - Technical skills matrix & tools
  <span style="color:#915eff">projects</span>      - Real-world production & systems builds
  <span style="color:#915eff">experience</span>    - AutoWhat internship & SFIT education
  <span style="color:#915eff">architecture</span>  - Redis atomic locks & edge AI RTSP pipelines
  <span style="color:#915eff">contact</span>       - Email, phone & GitHub links
  <span style="color:#915eff">resume</span>        - Full resume details & credentials
  <span style="color:#915eff">clear</span>         - Clear terminal screen
  <span style="color:#915eff">exit</span>          - Close terminal
        `);
        break;

      case 'about':
        printLine(`
<span style="color:#915eff; font-weight:700">Sarvesh Wadkar</span>
AI Full-Stack Systems Engineer · Recent Graduate (Class of 2026) from SFIT Mumbai.
Currently an on-site Full Stack Developer Intern at AutoWhat building Next.js 15 enterprise ERPs (Aahar) and Python/FastAPI computer vision workers processing live RTSP streams with YOLOv8 & ByteTrack.
        `);
        break;

      case 'skills':
        printLine(`
<span style="color:#915eff; font-weight:700">TECHNICAL SKILLS:</span>
• <span style="color:#c4b5fd">Languages:</span> TypeScript, JavaScript, Python, Java, SQL, HTML5, CSS3
• <span style="color:#c4b5fd">Frontend:</span> Next.js 15, React.js, Streamlit, Three.js 3D, Responsive UI
• <span style="color:#c4b5fd">Backend & Real-Time:</span> Node.js, Express.js, Socket.io, FastAPI (Python)
• <span style="color:#c4b5fd">Databases:</span> MongoDB, PostgreSQL, MySQL, Redis (Atomic Locks & TTL)
• <span style="color:#c4b5fd">AI & Computer Vision:</span> YOLOv8, ByteTrack, OpenCV, HuggingFace Transformers
• <span style="color:#c4b5fd">DevOps & Tools:</span> Docker, Docker Compose, Git, GitHub Actions, NetBird VPN
        `);
        break;

      case 'projects':
        printLine(`
<span style="color:#915eff; font-weight:700">FEATURED PROJECTS:</span>
1. <span style="color:#c4b5fd">CineBook:</span> Distributed seat reservation engine (Redis SET NX, Socket.io &lt;100ms sync, Docker Compose).
2. <span style="color:#c4b5fd">AI CCTV Edge Worker:</span> Python/FastAPI worker reading RTSP sub-streams from NVR, scaling to 15+ cameras.
3. <span style="color:#c4b5fd">Aahar ERP:</span> Next.js 15 manufacturing & distribution ERP with RBAC & automated ledger.
4. <span style="color:#c4b5fd">Verif-Ai:</span> LLM hallucination detection using HuggingFace cross-encoder NLI models.
5. <span style="color:#c4b5fd">WanderLust:</span> MVC full-stack rental platform with automated Render GitHub CI releases.
        `);
        break;

      case 'experience':
        printLine(`
<span style="color:#915eff; font-weight:700">EXPERIENCE & INTERNSHIP:</span>
• <span style="color:#c4b5fd">Full Stack Developer Intern (On-Site)</span> | AutoWhat (1st Sep 2026 – Present)
  - Next.js 15, TypeScript, MongoDB: Building Aahar manufacturing ERP with RBAC & payment flows.
  - Python/FastAPI: Built AI CCTV people-detection worker reading live RTSP feeds with YOLOv8 & ByteTrack.
  - Edge Architecture: On-premise sub-stream inference connected via private NetBird VPN.
        `);
        break;

      case 'architecture':
        printLine(`
<span style="color:#915eff; font-weight:700">SYSTEM ARCHITECTURE HIGHLIGHTS:</span>
• <span style="color:#34d399">Redis SET NX Atomic Locking:</span> Eliminates double-booking across 100+ concurrent requests with TTL auto-release.
• <span style="color:#34d399">RTSP Sub-stream Edge Processing:</span> Processes low-bitrate 480p streams directly on-premise without saturating network bandwidth.
• <span style="color:#34d399">NetBird VPN Mesh:</span> Encrypted WireGuard overlay tunnel eliminates open internet ports on IP cameras.
        `);
        break;

      case 'contact':
        printLine(`
<span style="color:#915eff; font-weight:700">CONTACT INFO:</span>
• Email: <a href="mailto:sarveshwadkar33@gmail.com" style="color:#c4b5fd;text-decoration:underline;">sarveshwadkar33@gmail.com</a>
• Phone: +91 9321784816
• GitHub: <a href="https://github.com/Draken970" target="_blank" style="color:#c4b5fd;text-decoration:underline;">github.com/Draken970</a>
• Location: Mumbai, Maharashtra, India
        `);
        break;

      case 'resume':
        printLine(`
<span style="color:#915eff; font-weight:700">RESUME & CREDENTIALS:</span>
• <a href="https://drive.google.com/file/d/1KOlCKIPTA4m3qXLN1r_ubqgrEQaBaO2d/view?usp=drivesdk" target="_blank" style="color:#ffffff; text-decoration:underline; font-weight:700;">Open Resume on Google Drive (PDF) ↗</a>
• Education: Recent Graduate (Class of 2026) · SFIT Mumbai
• Experience: On-Site Full Stack Developer Intern at AutoWhat (1st Sep 2026 – Present)
• Certifications: Full-Stack Web Development (MERN) & Java DSA — Apna College
        `);
        break;

      case 'clear':
        terminalOutput.innerHTML = '';
        return;

      case 'exit':
        closeTerminal();
        return;

      default:
        printLine(`<span style="color:#f43f5e">Command not recognized: '${escapeHtml(cmd)}'. Type <span style="color:#915eff">'help'</span> for list of commands.</span>`);
        break;
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function printLine(html) {
    const div = document.createElement('div');
    div.style.marginBottom = '0.6rem';
    div.innerHTML = html;
    terminalOutput.appendChild(div);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

/* --------------------------------------------------------------------------
   10. Copy to Clipboard
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.btn-copy');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied to clipboard: ${textToCopy}`);
        const originalText = btn.innerHTML;
        btn.innerHTML = `✓ Copied`;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        showToast(`Copy failed. Please copy manually.`);
      }
    });
  });
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* --------------------------------------------------------------------------
   11. Contact Form Logic
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('btn-contact-submit');
  const statusBox = document.getElementById('form-status');
  if (!form) return;

  function showStatus(msg, type) {
    if (!statusBox) return;
    statusBox.textContent = msg;
    statusBox.className = `form-status-box ${type}`;
    statusBox.style.display = 'block';
  }

  function hideStatus() {
    if (!statusBox) return;
    statusBox.style.display = 'none';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');

    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const message = messageInput?.value.trim();

    if (!name || !email || !message) {
      showStatus('Please fill in all fields before sending.', 'error');
      return;
    }

    // Set Loading State
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>Sending Message...</span>
        <svg class="form-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
        </svg>
      `;
    }
    hideStatus();

    try {
      const response = await fetch('https://formsubmit.co/ajax/sarveshwadkar33@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `[Portfolio Direct Message] from ${name}`,
          _captcha: 'false',
          _template: 'table'
        })
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok || result.success === 'true') {
        showStatus('✓ Message sent successfully! Delivered straight to Sarvesh Wadkar\'s inbox.', 'success');
        showToast('✓ Message sent directly to inbox!');
        form.reset();
      } else if (result.message && result.message.toLowerCase().includes('activation')) {
        showStatus('✓ Activation Notice: FormSubmit sent a 1-click confirmation link to sarveshwadkar33@gmail.com. Once confirmed, all messages arrive automatically!', 'info');
        showToast('Check email for 1-click activation!');
        form.reset();
      } else {
        throw new Error(result.message || 'Direct delivery request failed');
      }
    } catch (err) {
      console.warn('Direct delivery error, falling back to mailto:', err);
      showStatus('Notice: Direct API unavailable. Opening default email client fallback...', 'error');

      const mailtoUri = `mailto:sarveshwadkar33@gmail.com?subject=${encodeURIComponent(
        `[Portfolio Inquiry] from ${name}`
      )}&body=${encodeURIComponent(
        `Hi Sarvesh,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSent via 3D Portfolio`
      )}`;

      window.location.href = mailtoUri;
      showToast('Opening default email client...');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Send Message</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        `;
      }
    }
  });
}

/* --------------------------------------------------------------------------
   12. Resume Modal
   -------------------------------------------------------------------------- */
function initResumeModal() {
  const modalOverlay = document.getElementById('resume-modal');
  const openBtns = document.querySelectorAll('.btn-resume-modal');
  const closeBtn = document.getElementById('close-resume-modal');

  if (!modalOverlay) return;

  function openModal() {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   13. Smooth Scroll Helper
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   14. Engineering Impact Metrics Counter (Animated Roll-Up)
   -------------------------------------------------------------------------- */
function initMetricsCounter() {
  const metricCards = document.querySelectorAll('.metric-card');
  if (!metricCards.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.metric-number');
        if (numEl && !numEl.classList.contains('counted')) {
          numEl.classList.add('counted');
          animateCount(numEl);
        }
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  metricCards.forEach(card => observer.observe(card));

  function animateCount(el) {
    const target = parseFloat(el.getAttribute('data-target')) || 0;
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const startTime = performance.now();
    const isDecimal = suffix.includes('.9%');

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);

      if (isDecimal) {
        const decVal = (ease * 99.9).toFixed(1);
        el.textContent = `${prefix}${decVal}%`;
      } else {
        el.textContent = `${prefix}${current}${suffix}`;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (isDecimal) {
          el.textContent = `${prefix}99.9%`;
        } else {
          el.textContent = `${prefix}${target}${suffix}`;
        }
        if (window.playPortfolioSFX) window.playPortfolioSFX('tick');
      }
    }
    requestAnimationFrame(update);
  }
}

/* --------------------------------------------------------------------------
   15. Architecture Case Study Deep Dive Modals
   -------------------------------------------------------------------------- */
function initCaseStudyModal() {
  const modal = document.getElementById('case-study-modal');
  const titleEl = document.getElementById('case-study-title');
  const bodyEl = document.getElementById('case-study-body');
  const closeBtn = document.getElementById('close-case-study-modal');
  const openBtns = document.querySelectorAll('.btn-case-study');

  if (!modal || !titleEl || !bodyEl) return;

  const studies = {
    cinebook: {
      title: 'CineBook — High-Concurrency Ticket Reservation Engine',
      content: `
        <div class="case-study-metric-banner">
          🚀 <strong>Impact Summary:</strong> Zero double-bookings across 250 virtual user Artillery load tests · 48ms p95 lock acquisition latency · Sub-100ms multi-client WebSocket synchronization.
        </div>

        <h4 style="color:#fff; font-size:1.05rem; margin:1.5rem 0 0.5rem;">1. The Core Engineering Challenge</h4>
        <p style="color:var(--text-secondary); font-size:0.9rem;">
          In high-demand ticket sales, multiple users attempt to reserve the same seat within milliseconds of each other. Relying on traditional relational database row locks causes connection pool exhaustion, slow response spikes, and race conditions that result in catastrophic double-bookings.
        </p>

        <h4 style="color:#fff; font-size:1.05rem; margin:1.5rem 0 0.5rem;">2. Distributed Locking via Redis SET NX</h4>
        <p style="color:var(--text-secondary); font-size:0.9rem;">
          Instead of holding database transactions, the ingress API uses Redis atomic operations:
        </p>
        <pre style="background:#0a0a0a; border:1px solid var(--border-subtle); padding:1rem; border-radius:6px; font-family:var(--font-mono); font-size:0.8rem; color:#a78bfa; overflow-x:auto;">
// Single atomic round-trip: lock acquired only if NOT exists
const lockAcquired = await redis.set(\`lock:seat:\${seatId}\`, userId, 'NX', 'EX', 30);
if (!lockAcquired) {
  return res.status(409).json({ error: 'Seat currently reserved by another patron' });
}
// Broadcast instant lock state to other viewers via Socket.io Pub/Sub
io.emit('seat:locked', { seatId, userId });</pre>

        <h4 style="color:#fff; font-size:1.05rem; margin:1.5rem 0 0.5rem;">3. Key Tradeoffs &amp; Safeguards</h4>
        <ul style="color:var(--text-secondary); font-size:0.875rem; line-height:1.6; list-style-type:disc; padding-left:1.25rem;">
          <li><strong>Auto-Expiring TTL (30s):</strong> Prevents orphaned locks if a user abruptly drops connection or closes their browser before checkout.</li>
          <li><strong>Optimistic Concurrency at DB:</strong> PostgreSQL enforces a unique constraint on <code>(showing_id, seat_id)</code> as a final hard transactional safety net.</li>
          <li><strong>Containerization:</strong> Orchestrated with Docker Compose for seamless isolated deployments of Fastify, PostgreSQL, and Redis.</li>
        </ul>
      `
    },
    aicctv: {
      title: 'AI CCTV Edge Worker — Sub-Stream YOLOv8 & ByteTrack Pipeline',
      content: `
        <div class="case-study-metric-banner">
          🚀 <strong>Impact Summary:</strong> 54 FPS edge throughput · 18.4ms per-frame inference · 78.4% bandwidth reduction · Zero open router inbound ports via NetBird WireGuard mesh.
        </div>

        <h4 style="color:#fff; font-size:1.05rem; margin:1.5rem 0 0.5rem;">1. The Core Engineering Challenge</h4>
        <p style="color:var(--text-secondary); font-size:0.9rem;">
          Streaming 15+ 4K camera feeds over WAN to cloud GPUs consumes immense uplink bandwidth (16+ Mbps per camera), incurs prohibitive cloud compute bills, and introduces latency unacceptable for live security alerting.
        </p>

        <h4 style="color:#fff; font-size:1.05rem; margin:1.5rem 0 0.5rem;">2. Dual-Stream RTSP Ingestion Architecture</h4>
        <p style="color:var(--text-secondary); font-size:0.9rem;">
          Engineered an on-site edge worker using Python and FastAPI directly colocated with the building's NVR. The pipeline splits video duties:
        </p>
        <ul style="color:var(--text-secondary); font-size:0.875rem; line-height:1.6; list-style-type:disc; padding-left:1.25rem;">
          <li><strong>Primary 4K Stream:</strong> Recorded continuously to local hard disks inside the NVR without processing overhead.</li>
          <li><strong>Sub-stream (480p / D1 @ 1.2 Mbps):</strong> Ingested into OpenCV/FFmpeg frames, processed through FP16 YOLOv8n object detection at 54 FPS.</li>
        </ul>

        <h4 style="color:#fff; font-size:1.05rem; margin:1.5rem 0 0.5rem;">3. Identity Persistence &amp; Zero-Trust Networking</h4>
        <ul style="color:var(--text-secondary); font-size:0.875rem; line-height:1.6; list-style-type:disc; padding-left:1.25rem;">
          <li><strong>ByteTrack Tracking:</strong> Employs Kalman filters and Hungarian matching to retain track IDs even when people are briefly occluded behind pillars.</li>
          <li><strong>NetBird Mesh Tunnel:</strong> Operates entirely behind NAT/firewall without port forwarding or public static IPs, safeguarding the facility from intrusion.</li>
        </ul>
      `
    },
    aahar: {
      title: 'Aahar ERP — Next.js 15 Multi-Tenant Distribution Platform',
      content: `
        <div class="case-study-metric-banner">
          🚀 <strong>Impact Summary:</strong> 99.9% production reliability · Order dispatch time reduced from 4 hours to 12 minutes · Multi-tenant RBAC with automated double-entry ledger.
        </div>

        <h4 style="color:#fff; font-size:1.05rem; margin:1.5rem 0 0.5rem;">1. The Core Engineering Challenge</h4>
        <p style="color:var(--text-secondary); font-size:0.9rem;">
          Managing high-volume food and agricultural manufacturing across disparate warehouses resulted in inventory sync drift, accidental negative stock allocations, and sluggish manual reconciliation.
        </p>

        <h4 style="color:#fff; font-size:1.05rem; margin:1.5rem 0 0.5rem;">2. Atomic Stock Decrement &amp; Next.js 15 Server Actions</h4>
        <p style="color:var(--text-secondary); font-size:0.9rem;">
          Utilized Next.js 15 Server Actions with direct MongoDB atomic update operators to enforce strict non-negative inventory balances:
        </p>
        <pre style="background:#0a0a0a; border:1px solid var(--border-subtle); padding:1rem; border-radius:6px; font-family:var(--font-mono); font-size:0.8rem; color:#a78bfa; overflow-x:auto;">
// Atomic decrement guarded by available stock condition
const result = await Inventory.updateOne(
  { _id: itemId, stock: { $gte: requestedQty } },
  { $inc: { stock: -requestedQty }, $set: { updatedAt: new Date() } }
);
if (result.matchedCount === 0) {
  throw new Error('Insufficient inventory available for requested quantity');
}</pre>

        <h4 style="color:#fff; font-size:1.05rem; margin:1.5rem 0 0.5rem;">3. Architecture Highlights</h4>
        <ul style="color:var(--text-secondary); font-size:0.875rem; line-height:1.6; list-style-type:disc; padding-left:1.25rem;">
          <li><strong>Role-Based Access Control (RBAC):</strong> Granular permissions separating Admins, Dispatch Drivers, and Sales Reps.</li>
          <li><strong>Automated PDF Invoicing:</strong> Invoices and delivery manifests generated synchronously upon order confirmation.</li>
        </ul>
      `
    }
  };

  function openStudy(key) {
    const data = studies[key];
    if (!data) return;
    titleEl.textContent = data.title;
    bodyEl.innerHTML = data.content;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.playPortfolioSFX) window.playPortfolioSFX('modal');
  }

  function closeStudy() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const proj = btn.getAttribute('data-project');
      openStudy(proj);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeStudy);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeStudy();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeStudy();
  });
}

/* --------------------------------------------------------------------------
   18. Web Audio API Sci-Fi Sound Synthesizer (Zero External Audio Assets)
   -------------------------------------------------------------------------- */
function initWebAudioSFX() {
  const toggleBtn = document.getElementById('sfx-toggle-btn');
  const sfxIcon = document.getElementById('sfx-icon');
  const sfxLabel = document.getElementById('sfx-label');
  let audioCtx = null;
  let sfxEnabled = false;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSound(type) {
    if (!sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'tick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'tab') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.06);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'modal') {
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.025, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.12);
      });
    } else if (type === 'action') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  }

  window.playPortfolioSFX = playSound;

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      if (sfxEnabled) {
        toggleBtn.classList.add('active');
        if (sfxIcon) sfxIcon.textContent = '🔊';
        if (sfxLabel) sfxLabel.textContent = 'SFX ON';
        getAudioContext();
        playSound('modal');
      } else {
        toggleBtn.classList.remove('active');
        if (sfxIcon) sfxIcon.textContent = '🔇';
        if (sfxLabel) sfxLabel.textContent = 'SFX OFF';
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('button, .term-chip, .filter-btn, .arch-node-item')) {
      playSound('click');
    }
  });
}

