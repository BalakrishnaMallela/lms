"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshPhongMaterial,
  Mesh,
  DirectionalLight,
  AmbientLight,
  Color,
  CylinderGeometry,
  SphereGeometry,
  LineBasicMaterial,
  BufferGeometry,
  Vector3,
  Line,
} from "three";
import {
  Wifi,
  Server,
  Smartphone,
  Router,
  Database,
  BarChart3,
  Settings,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Globe,
  Signal,
  LogOut,
} from "lucide-react";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const [user, setUser] = useState(null);

  const heroRef = useRef();
  const featuresRef = useRef();
  const statsRef = useRef();

  const heroInView = useInView(heroRef, { once: true, threshold: 0.3 });
  const featuresInView = useInView(featuresRef, { once: true, threshold: 0.2 });
  const statsInView = useInView(statsRef, { once: true, threshold: 0.3 });

  // Check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.isLoggedIn) {
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    };

    checkLoginStatus();
    // Check periodically for changes
    const interval = setInterval(checkLoginStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Three.js Scene
  const canvasRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });

    sceneRef.current = scene;
    rendererRef.current = renderer;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Lighting
    const ambientLight = new AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create telecom tower
    const towerGeometry = new CylinderGeometry(0.1, 0.3, 4, 8);
    const towerMaterial = new MeshPhongMaterial({ color: 0x4a90e2 });
    const tower = new Mesh(towerGeometry, towerMaterial);
    tower.position.y = 2;
    scene.add(tower);

    // Create antenna parts
    const antennaGeometry = new CylinderGeometry(0.05, 0.05, 1, 6);
    const antennaMaterial = new MeshPhongMaterial({ color: 0xff6b6b });

    for (let i = 0; i < 3; i++) {
      const antenna = new Mesh(antennaGeometry, antennaMaterial);
      antenna.position.y = 4 + i * 0.3;
      antenna.rotation.z = (i * Math.PI) / 6;
      scene.add(antenna);
    }

    // Create floating network nodes
    const nodes = [];
    const nodeGeometry = new SphereGeometry(0.2, 16, 16);
    const nodeMaterials = [
      new MeshPhongMaterial({ color: 0x50fa7b }),
      new MeshPhongMaterial({ color: 0xff79c6 }),
      new MeshPhongMaterial({ color: 0x8be9fd }),
      new MeshPhongMaterial({ color: 0xf1fa8c }),
    ];

    for (let i = 0; i < 8; i++) {
      const node = new Mesh(
        nodeGeometry,
        nodeMaterials[i % nodeMaterials.length],
      );
      node.position.set(
        (Math.random() - 0.5) * 10,
        Math.random() * 8,
        (Math.random() - 0.5) * 10,
      );
      nodes.push(node);
      scene.add(node);
    }

    // Create connecting lines
    const lines = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const points = [nodes[i].position, nodes[i + 1].position];
      const geometry = new BufferGeometry().setFromPoints(points);
      const material = new LineBasicMaterial({
        color: 0x6272a4,
        opacity: 0.6,
        transparent: true,
      });
      const line = new Line(geometry, material);
      lines.push(line);
      scene.add(line);
    }

    camera.position.z = 8;
    camera.position.y = 3;

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate tower
      tower.rotation.y += 0.005;

      // Animate nodes
      nodes.forEach((node, index) => {
        node.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        node.rotation.x += 0.01;
        node.rotation.y += 0.01;
      });

      // Update lines
      lines.forEach((line, index) => {
        if (index < nodes.length - 1) {
          const points = [nodes[index].position, nodes[index + 1].position];
          line.geometry.setFromPoints(points);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  const features = [
    {
      icon: <Database className="w-8 h-8" />,
      title: "Real-time Inventory",
      description:
        "Track all telecom equipment in real-time with automated updates and alerts",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "Network Monitoring",
      description:
        "Monitor network performance and equipment status across all locations",
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description:
        "Get insights with advanced analytics and predictive maintenance",
      color: "from-green-400 to-emerald-400",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security & Compliance",
      description:
        "Enterprise-grade security with compliance tracking and reporting",
      color: "from-orange-400 to-red-400",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Uptime" },
    { value: "10K+", label: "Devices Managed" },
    { value: "500+", label: "Clients Worldwide" },
    { value: "24/7", label: "Support" },
  ];

  const inventoryItems = [
    { icon: <Router className="w-6 h-6" />, name: "Routers" },
    { icon: <Server className="w-6 h-6" />, name: "Servers" },
    { icon: <Smartphone className="w-6 h-6" />, name: "Mobile Devices" },
    { icon: <Signal className="w-6 h-6" />, name: "Antennas" },
    { icon: <Wifi className="w-6 h-6" />, name: "WiFi Access Points" },
    { icon: <Globe className="w-6 h-6" />, name: "Network Switches" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Three.js Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0"
        style={{ background: "transparent" }}
      />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-10">
        <motion.div className="absolute inset-0" style={{ y, opacity }}>
          <div
            className="w-full h-full"
            style={{
              background: `
                radial-gradient(circle at 20% 80%, rgba(79, 172, 254, 0.2) 0%, transparent 60%),
                radial-gradient(circle at 80% 20%, rgba(139, 233, 253, 0.15) 0%, transparent 60%),
                radial-gradient(circle at 40% 40%, rgba(80, 250, 123, 0.1) 0%, transparent 60%),
                linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(17,24,39,0.8) 100%)
              `,
            }}
          />
        </motion.div>
      </div>

      {/* Floating Inventory Items */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        {inventoryItems.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-white/20"
            initial={{ x: -100, y: Math.random() * window.innerHeight }}
            animate={{
              x: window.innerWidth + 100,
              y: Math.random() * window.innerHeight,
              rotate: 360,
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              delay: index * 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              top: Math.random() * window.innerHeight,
              fontSize: Math.random() * 20 + 30,
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      <div className="relative z-30">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="fixed top-0 w-full p-6 z-50"
        >
          <div
            className="max-w-7xl mx-auto backdrop-blur-3xl bg-black/20 border border-white/20 rounded-2xl px-8 py-4 shadow-2xl"
            style={{
              background: `
                linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%),
                rgba(0,0,0,0.2)
              `,
              backdropFilter: "blur(20px)",
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.4), 
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
            }}
          >
            <div className="flex justify-between items-center">
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Signal className="w-6 h-6 text-white font-bold" />
                </div>
                <span className="text-xl font-bold text-white">TelecomIMS</span>
              </motion.div>

              <div className="hidden md:flex space-x-8">
                {["Home", "About", "Contact"].map((item) => (
                  <motion.a
                    key={item}
                    href="#"
                    className="text-white/80 hover:text-white font-bold transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>

              {/* Login/User Section */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-bold text-sm">
                        Welcome, {user.name}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-400/30 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(79, 172, 254, 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => (window.location.href = "/login")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all duration-200"
                  >
                    Login
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section
          ref={heroRef}
          className="min-h-screen flex items-center justify-center px-6 pt-32"
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={heroInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.h1
                className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight"
                initial={{ y: 100, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Telecom{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                  Inventory
                </span>
                <br />
                Management
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto font-bold"
                initial={{ y: 50, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Revolutionize your telecom operations with AI-powered inventory
                management, real-time monitoring, and predictive analytics.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                initial={{ y: 50, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(79, 172, 254, 0.4)",
                    background:
                      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center space-x-3 transition-all duration-300"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
                >
                  Watch Demo
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={statsInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    animate={
                      statsInView
                        ? {
                            backgroundPosition: [
                              "0% 50%",
                              "100% 50%",
                              "0% 50%",
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-2"
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-white/60 font-bold text-lg">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={featuresInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Powerful Features for Modern{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Telecom
                </span>
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto font-bold">
                Everything you need to manage your telecom infrastructure
                efficiently and effectively
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
                  animate={featuresInView ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)",
                  }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6`}
                  >
                    {feature.icon}
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-white/70 text-lg font-bold leading-relaxed">
                    {feature.description}
                  </p>

                  <motion.div
                    className="flex items-center text-blue-400 mt-6 font-bold"
                    whileHover={{ x: 10 }}
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="backdrop-blur-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-white/20 rounded-3xl p-12"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(79, 172, 254, 0.3)",
                    "0 0 40px rgba(79, 172, 254, 0.6)",
                    "0 0 20px rgba(79, 172, 254, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex p-4 rounded-full bg-blue-600/20 mb-8"
              >
                <Zap className="w-8 h-8 text-blue-400" />
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Telecom Operations?
                </span>
              </h2>

              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto font-bold">
                Join thousands of telecom professionals who trust our platform
                to manage their inventory and optimize their operations.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(79, 172, 254, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                >
                  Start Your Free Trial
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
                >
                  Contact Sales
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Signal className="w-5 h-5 text-white font-bold" />
              </div>
              <span className="text-lg font-bold text-white">TelecomIMS</span>
            </div>
            <p className="text-white/60 font-bold">
              © 2025 TelecomIMS. All rights reserved. Transforming telecom
              infrastructure management worldwide.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}



